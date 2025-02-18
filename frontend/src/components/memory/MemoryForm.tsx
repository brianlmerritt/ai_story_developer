import React, { useState, useEffect } from 'react';
import type { Memory, Chapter } from '../../types';
import { AutoResizeTextarea } from '../shared/AutoResizeTextarea';
import { StatusSelect, type Status } from '../shared/StatusSelect';
import { MultiSelect } from '../shared/MultiSelect';

interface MemoryFormProps {
  memory?: Memory | null;
  chapters: Chapter[];
  characters: Array<{ id: number; name: string }>;
  locations: Array<{ id: number; name: string }>;
  discoveries: Array<{ id: number; name: string }>;
  onSubmit: (data: Partial<Memory>) => void;
  onCancel?: () => void;
}

export const MemoryForm: React.FC<MemoryFormProps> = ({
  memory,
  chapters,
  characters,
  locations,
  discoveries,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Memory>>({
    title: '',
    summary: '',
    description: '',
    key_details_and_quirks: '',
    chapter_id: undefined,
    characters: {},
    locations: {},
    status: 'draft' as Status,
  });

  useEffect(() => {
    if (memory) {
      setFormData({
        ...memory,
        status: memory.status || 'draft' as Status,
      });
    } else {
      setFormData({
        title: '',
        summary: '',
        description: '',
        key_details_and_quirks: '',
        chapter_id: undefined,
        characters: {},
        locations: {},
        status: 'draft' as Status,
      });
    }
  }, [memory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 h-full overflow-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <StatusSelect
              value={formData.status || ''}
              onChange={(status) => setFormData(prev => ({ ...prev, status }))}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Chapter</label>
          <select
            name="chapter_id"
            value={formData.chapter_id || ''}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
            required
          >
            <option value="">Select a chapter</option>
            {chapters.map(chapter => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.sequence ? `${chapter.sequence} - ` : ''}{chapter.title}
              </option>
            ))}
          </select>
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
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <AutoResizeTextarea
            name="summary"
            value={formData.summary || ''}
            onChange={handleChange}
            className="w-full rounded-lg border p-2 resize-y min-h-[3em]"
            minRows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <AutoResizeTextarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full rounded-lg border p-2 resize-y min-h-[3em]"
            minRows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Key Details & Quirks</label>
          <AutoResizeTextarea
            name="key_details_and_quirks"
            value={formData.key_details_and_quirks || ''}
            onChange={handleChange}
            className="w-full rounded-lg border p-2 resize-y min-h-[3em]"
            minRows={3}
          />
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
            {memory ? 'Update' : 'Create'} Memory
          </button>
        </div>
      </div>
    </form>
  );
};

export default MemoryForm;