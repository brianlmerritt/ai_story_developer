import React, { useState, useEffect } from 'react';
import type { Chapter } from '../../types';
import { AutoResizeTextarea } from '../shared/AutoResizeTextarea';
import { StatusSelect, type Status } from '../shared/StatusSelect';

interface ChapterFormProps {
  chapter?: Chapter | null;
  novelId: number;
  onSubmit: (data: Partial<Chapter>) => void;
  onCancel?: () => void;
}

export const ChapterForm: React.FC<ChapterFormProps> = ({
  chapter,
  novelId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Chapter>>({
    title: '',
    summary: '',
    sequence: '',
    description: '',
    novel_id: novelId,
    status: 'draft' as Status
  });

  useEffect(() => {
    if (chapter) {
      setFormData({
        ...chapter,
        status: chapter.status || 'draft' as Status,
      });
    } else {
      setFormData({
        title: '',
        summary: '',
        sequence: '',
        description: '',
        novel_id: novelId,
        status: 'draft' as Status
      });
    }
  }, [chapter, novelId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: formData.status || 'draft',
    });
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
            <label className="block text-sm font-medium text-gray-700">Title</label>
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
          <label className="block text-sm font-medium mb-1">Sequence (optional)</label>
          <input
            type="text"
            name="sequence"
            value={formData.sequence || ''}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
            placeholder="e.g., 1, 2, 2.1"
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
            {chapter ? 'Update' : 'Create'} Chapter
          </button>
        </div>
      </div>
    </form>
  );
}; 