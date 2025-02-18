import React from 'react';
import { Plus } from 'lucide-react';
import type { Chapter, Scene } from '../../types';

interface ChapterListProps {
  chapters: Chapter[];
  scenes: Scene[];
  activeChapter: number | null;
  activeScene: number | null;
  onChapterSelect: (chapter: Chapter) => void;
  onAddChapter: () => void;
  onSceneSelect: (scene: Scene) => void;
  onAddScene: () => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  scenes,
  activeChapter,
  activeScene,
  onChapterSelect,
  onAddChapter,
  onSceneSelect,
  onAddScene,
}) => (
  <div className="h-full border-r bg-gray-50">
    <div className="flex items-center justify-between p-4 border-b">
      <button
        onClick={onAddChapter}
        className="p-1 rounded-lg hover:bg-gray-100"
        title="Add Chapter"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
    <div className="p-4 space-y-2 overflow-auto">
      {chapters.map(chapter => (
        <div key={chapter.id} className="space-y-2">
          <button
            className={`w-full rounded-lg p-3 text-left shadow hover:bg-blue-50
              ${activeChapter === chapter.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
            onClick={() => onChapterSelect(chapter)}
          >
            {chapter.title}
          </button>
          
          {/* Show scenes when chapter is active */}
          {activeChapter === chapter.id && (
            <div className="pl-4 space-y-2">
              {scenes
                .filter(scene => scene.chapter_id === chapter.id)
                .map(scene => (
                  <button
                    key={scene.id}
                    className={`w-full rounded-lg p-2 text-left shadow-sm hover:bg-blue-50
                      ${activeScene === scene.id ? 'bg-blue-100' : 'bg-white'}`}
                    onClick={() => onSceneSelect(scene)}
                  >
                    {scene.name}
                  </button>
                ))
              }
              <button
                onClick={onAddScene}
                className="w-full rounded-lg p-2 text-left text-sm text-gray-500 hover:bg-gray-100 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Scene
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
); 