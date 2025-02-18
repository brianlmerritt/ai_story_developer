import React, { useState, useEffect } from 'react';
import type { Discovery, Chapter } from '../../types';
import { AutoResizeTextarea } from '../shared/AutoResizeTextarea';
import { chapterApi } from '../../services/chapterApi';
import { StatusSelect, type Status } from '../shared/StatusSelect';

interface DiscoveryFormProps {
  discovery?: Discovery | null;
  onSubmit: (data: Partial<Discovery>) => void;
  onCancel?: () => void;
}

export const DiscoveryForm: React.FC<DiscoveryFormProps> = ({
  discovery,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Discovery>>({
    name: '',
    summary: '',
    description: '',
    key_details_and_quirks: '',
    foreshadow_chapter_id: undefined,
    reveal_chapter_id: undefined,
    characters: {},
    locations: {},
    status: 'draft' as Status,
  });
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    loadChapters();
  }, []);

  useEffect(() => {
    if (discovery) {
      setFormData({
        ...discovery,
        status: discovery.status || 'draft' as Status,
      });
    } else {
      setFormData({
        name: '',
        summary: '',
        description: '',
        key_details_and_quirks: '',
        foreshadow_chapter_id: undefined,
        reveal_chapter_id: undefined,
        characters: {},
        locations: {},
        status: 'draft' as Status,
      });
    }
  }, [discovery]);

  const loadChapters = async () => {
    try {
      const data = await chapterApi.list();
      setChapters(data);
    } catch (err) {
      console.error('Failed to load chapters:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Discovery) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let value: string | number | undefined = e.target.value;
    
    if (field === 'foreshadow_chapter_id' || field === 'reveal_chapter_id') {
      const numValue = e.target.value ? Number(e.target.value) : undefined;
      setFormData(prev => ({
        ...prev,
        [field]: numValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 h-full overflow-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
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
            <label className="block text-sm font-medium text-gray-700">Status</label>
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
          <label className="block text-sm font-medium mb-1">Key Details & Quirks</label>
          <AutoResizeTextarea
            name="key_details_and_quirks"
            value={formData.key_details_and_quirks || ''}
            onChange={handleChange('key_details_and_quirks')}
            className="w-full rounded-lg border p-2 resize-y min-h-[3em]"
            minRows={3}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Foreshadow Chapter</label>
            <select
              name="foreshadow_chapter_id"
              value={formData.foreshadow_chapter_id ?? ''}
              onChange={handleChange('foreshadow_chapter_id')}
              className="w-full rounded-lg border p-2"
            >
              <option value="">Select Chapter</option>
              {chapters.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Reveal Chapter</label>
            <select
              name="reveal_chapter_id"
              value={formData.reveal_chapter_id ?? ''}
              onChange={handleChange('reveal_chapter_id')}
              className="w-full rounded-lg border p-2"
            >
              <option value="">Select Chapter</option>
              {chapters.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
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
            {discovery ? 'Update' : 'Create'} Discovery
          </button>
        </div>
      </div>
    </form>
  );
};

export default DiscoveryForm; 