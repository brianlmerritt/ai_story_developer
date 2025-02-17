#!/usr/bin/env python3
import os
import re
import shutil
from jinja2 import Template

def natural_sort_key(text):
    """
    Splits the text into a list of integers and non-digit substrings to allow
    natural sorting (e.g. scene_1a comes before scene_1b, and scene_1b comes before scene_10a).
    """
    return [int(c) if c.isdigit() else c.lower() for c in re.split('(\d+)', text)]

class ChapterPrepare:
    def __init__(self, story_name, chapter_name):
        self.story_name = story_name
        # We assume the chapter name corresponds to the scene folder name.
        self.scene_name = chapter_name
        self.base_path = os.path.join("stories", self.story_name)
        self.scene_path = os.path.join(self.base_path, "scenes", self.scene_name)
        # The master input content is assumed to reside under scenes/master/<subdir>
        self.master_input_path = os.path.join(self.base_path, "scenes", "master")
        # The prompt template is under master/prompt_templates/
        self.prompt_template_path = os.path.join(self.base_path, "master", "prompt_templates", "scene_writer.md")
        # The input subdirectories we care about.
        self.input_subdirs = ["characters", "discoveries", "locations", "memories"]

    def get_previous_scene(self):
        """
        Returns the name of the previous scene directory (ignoring 'master')
        that is natural-sort less than the current scene.
        If multiple candidates exist, the one with the highest order is chosen.
        Returns None if no such scene exists.
        """
        scenes_dir = os.path.join(self.base_path, "scenes")
        candidates = []
        for entry in os.listdir(scenes_dir):
            full_path = os.path.join(scenes_dir, entry)
            if entry.lower() == "master":
                continue
            if not os.path.isdir(full_path):
                continue
            if entry == self.scene_name:
                continue
            if natural_sort_key(entry) < natural_sort_key(self.scene_name):
                candidates.append(entry)
        if not candidates:
            return None
        # Sort candidates naturally and return the last (i.e. the highest among those less than current)
        candidates.sort(key=natural_sort_key)
        return candidates[-1]

    def prepare(self):
        # Check that the story and scene directories exist.
        if not os.path.exists(self.base_path):
            raise FileNotFoundError(f"Story folder not found: {self.base_path}")
        if not os.path.exists(self.scene_path):
            raise FileNotFoundError(f"Scene folder not found: {self.scene_path}")

        # Read scene directions from scene_directions.md.
        scene_directions_file = os.path.join(self.scene_path, "scene_directions.md")
        if not os.path.exists(scene_directions_file):
            raise FileNotFoundError(f"Scene directions file not found: {scene_directions_file}")
        with open(scene_directions_file, "r", encoding="utf-8") as f:
            scene_directions_content = f.read()

        # Optionally load previous scene discoveries content.
        scene_discoveries_file = os.path.join(self.scene_path, "scene_discoveries.md")
        if os.path.exists(scene_discoveries_file):
            with open(scene_discoveries_file, "r", encoding="utf-8") as f:
                scene_discoveries_content = f.read()
        else:
            scene_discoveries_content = ""

        # Ensure the input folder exists within the scene folder.
        input_path = os.path.join(self.scene_path, "input")
        if not os.path.exists(input_path):
            os.makedirs(input_path)

        # For each expected subdirectory, if empty, first try copying from a previous scene,
        # and if that fails, copy from the master folder.
        fallback_scene = self.get_previous_scene()
        for sub in self.input_subdirs:
            dest_sub_path = os.path.join(input_path, sub)
            if not os.path.exists(dest_sub_path):
                os.makedirs(dest_sub_path)
            if not os.listdir(dest_sub_path):
                copied = False
                # First, try fallback scene if one exists.
                if fallback_scene is not None:
                    fallback_sub_path = os.path.join(self.base_path, "scenes", fallback_scene, "input", sub)
                    if os.path.exists(fallback_sub_path) and os.listdir(fallback_sub_path):
                        for filename in os.listdir(fallback_sub_path):
                            src_file = os.path.join(fallback_sub_path, filename)
                            dest_file = os.path.join(dest_sub_path, filename)
                            if os.path.isfile(src_file):
                                shutil.copy(src_file, dest_file)
                        copied = True
                        print(f"Copied '{sub}' content from fallback scene '{fallback_scene}'.")
                # If no fallback content was found, fall back to master.
                if not copied:
                    src_sub_path = os.path.join(self.master_input_path, sub)
                    if os.path.exists(src_sub_path):
                        for filename in os.listdir(src_sub_path):
                            src_file = os.path.join(src_sub_path, filename)
                            dest_file = os.path.join(dest_sub_path, filename)
                            if os.path.isfile(src_file):
                                shutil.copy(src_file, dest_file)
                        print(f"Copied '{sub}' content from master folder.")
                    else:
                        print(f"Warning: Master input subdirectory not found for '{sub}' at {src_sub_path}")

        # Concatenate the content of all files in each input subdirectory.
        contents = {}
        for sub in self.input_subdirs:
            sub_path = os.path.join(input_path, sub)
            content_list = []
            # Sort files for consistency.
            for filename in sorted(os.listdir(sub_path)):
                file_path = os.path.join(sub_path, filename)
                if os.path.isfile(file_path):
                    with open(file_path, "r", encoding="utf-8") as f:
                        content_list.append(f.read())
            contents[f"{sub}_content"] = "\n".join(content_list)

        # Load the prompt template (assumed to be in Jinja2 format).
        if not os.path.exists(self.prompt_template_path):
            raise FileNotFoundError(f"Prompt template not found: {self.prompt_template_path}")
        with open(self.prompt_template_path, "r", encoding="utf-8") as f:
            prompt_template_text = f.read()
        template = Template(prompt_template_text)

        # Render the prompt substituting in the various content pieces.
        scene_prompt = template.render(
            characters_content=contents.get("characters_content", ""),
            discoveries_content=contents.get("discoveries_content", ""),
            locations_content=contents.get("locations_content", ""),
            memories_content=contents.get("memories_content", ""),
            scene_discoveries_content=scene_discoveries_content  # previous discoveries (if any)
        )

        # Save the rendered prompt to scene_prompt.md.
        scene_prompt_path = os.path.join(self.scene_path, "scene_prompt.md")
        with open(scene_prompt_path, "w", encoding="utf-8") as f:
            f.write(scene_prompt)

        return scene_prompt

def chapter_prepare(story_name, chapter_name):
    cp = ChapterPrepare(story_name, chapter_name)
    return cp.prepare()

if __name__ == '__main__':
    # When run via CLI, prompt the user for inputs.
    story_name_input = input("Enter story name (story_name=): ").strip()
    chapter_name_input = input("Enter chapter name (chapter_name=): ").strip()
    try:
        prompt = chapter_prepare(story_name_input, chapter_name_input)
        print("Scene prompt generated successfully:")
        print(prompt)
    except Exception as e:
        print(f"Error: {e}")
