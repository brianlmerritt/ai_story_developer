import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { Scene, Chapter, Character, Location, Discovery, Memory } from '../../types';
import { AutoResizeTextarea } from '../shared/AutoResizeTextarea';
import { StatusSelect, type Status } from '../shared/StatusSelect';
import { MultiSelect } from '../shared/MultiSelect';

interface SceneFormProps {
  scene?: Scene | null;
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
  discoveries: Discovery[];
  memories: Memory[];
  onSubmit: (data: Partial<Scene>) => void;
  onCancel?: () => void;
  onActivate?: (data: Partial<Scene>) => void;
  onDeactivate?: () => void;
}

export const SceneForm = forwardRef<HTMLFormElement, SceneFormProps>(({
  scene,
  chapters = [],
  characters = [],
  locations = [],
  discoveries = [],
  memories = [],
  onSubmit,
  onCancel,
  onActivate,
  onDeactivate
}, ref) => {
  const [formData, setFormData] = useState<Partial<Scene>>({
    name: '',
    content: '',
    summary: '',
    sequence: '',
    chapter_id: undefined,
    status: 'draft' as Status,
    description: '',
    scene_beats: '',
    characters: {},
    locations: {},
    discoveries: {},
    memories: {},
  });

  useEffect(() => {
    if (scene) {
      setFormData({
        ...scene,
        status: scene.status || 'draft' as Status,
      });
    }
  }, [scene]);

  useEffect(() => {
    if (!scene && chapters.length > 0 && !formData.chapter_id) {
      setFormData(prev => ({
        ...prev,
        chapter_id: chapters[0].id
      }));
    }
  }, [chapters, scene]);

  // Notify parent when form becomes active
  useEffect(() => {
    onActivate?.(formData);
    return () => onDeactivate?.();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Scene) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="p-6 h-full overflow-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange('name')}
              className="w-full rounded-lg border p-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <StatusSelect
              value={formData.status || ''}
              onChange={(status) => setFormData(prev => ({ ...prev, status }))}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <AutoResizeTextarea
            name="summary"
            value={formData.summary || ''}
            onChange={handleChange('summary')}
            className="w-full rounded-lg border p-2 resize-y min-h-[3em]"
            minRows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sequence (optional)</label>
          <input
            type="text"
            name="sequence"
            value={formData.sequence || ''}
            onChange={handleChange('sequence')}
            className="w-full rounded-lg border p-2"
            placeholder="e.g., 1, 2, 2.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <AutoResizeTextarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange('description')}
            className="w-full rounded-lg border p-2 resize-y min-h-[3em]"
            minRows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Scene Beats</label>
          <AutoResizeTextarea
            name="scene_beats"
            value={formData.scene_beats || ''}
            onChange={handleChange('scene_beats')}
            className="w-full rounded-lg border p-2 resize-y min-h-[3em]"
            minRows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <AutoResizeTextarea
            name="content"
            value={formData.content || ''}
            onChange={handleChange('content')}
            className="w-full rounded-lg border p-2 resize-y min-h-[3em]"
            minRows={5}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Characters</label>
            <MultiSelect
              options={characters.map(char => ({
                value: char.id.toString(),
                label: char.name
              }))}
              value={Object.entries(formData.characters || {}).map(([nickname, id]) => ({
                value: id.toString(),
                label: nickname
              }))}
              onChange={(selected) => {
                const characters = selected.reduce((acc, item) => ({
                  ...acc,
                  [item.label]: parseInt(item.value)
                }), {});
                setFormData(prev => ({ ...prev, characters }));
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Locations</label>
            <MultiSelect
              options={locations.map(loc => ({
                value: loc.id.toString(),
                label: loc.name
              }))}
              value={Object.entries(formData.locations || {}).map(([name, id]) => ({
                value: id.toString(),
                label: name
              }))}
              onChange={(selected) => {
                const locations = selected.reduce((acc, item) => ({
                  ...acc,
                  [item.label]: parseInt(item.value)
                }), {});
                setFormData(prev => ({ ...prev, locations }));
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discoveries</label>
            <MultiSelect
              options={discoveries.map(disc => ({
                value: disc.id.toString(),
                label: disc.name
              }))}
              value={Object.entries(formData.discoveries || {}).map(([name, id]) => ({
                value: id.toString(),
                label: name
              }))}
              onChange={(selected) => {
                const discoveries = selected.reduce((acc, item) => ({
                  ...acc,
                  [item.label]: parseInt(item.value)
                }), {});
                setFormData(prev => ({ ...prev, discoveries }));
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Memories</label>
            <MultiSelect
              options={memories.map(mem => ({
                value: mem.id.toString(),
                label: mem.title
              }))}
              value={Object.entries(formData.memories || {}).map(([title, id]) => ({
                value: id.toString(),
                label: title
              }))}
              onChange={(selected) => {
                const memories = selected.reduce((acc, item) => ({
                  ...acc,
                  [item.label]: parseInt(item.value)
                }), {});
                setFormData(prev => ({ ...prev, memories }));
              }}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            {scene ? 'Update' : 'Create'} Scene
          </button>
        </div>
      </div>
    </form>
  );
});

export default SceneForm; 