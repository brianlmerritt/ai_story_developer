import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { Chapter, Scene } from '../../types';
import { AutoResizeTextarea } from '../shared/AutoResizeTextarea';
import { StatusSelect, type Status } from '../shared/StatusSelect';
import { SceneForm } from '../scene/SceneForm';

interface ChapterFormProps {
  chapter?: Chapter | null;
  onSubmit: (data: Partial<Chapter>) => void;
  onCancel?: () => void;
  onActivate?: (data: Partial<Chapter>) => void;
  onDeactivate?: () => void;
}

export const ChapterForm = forwardRef<HTMLFormElement, ChapterFormProps>(({
  chapter,
  onSubmit,
  onCancel,
  onActivate,
  onDeactivate
}, ref) => {
  const [formData, setFormData] = useState<Partial<Chapter>>({
    title: '',
    summary: '',
    sequence: '',
    description: '',
    status: 'draft' as Status,
  });

  // Ref for the embedded SceneForm
  const sceneFormRef = useRef<HTMLFormElement>(null);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);

  useEffect(() => {
    if (chapter) {
      setFormData({
        ...chapter,
        status: chapter.status || 'draft' as Status,
      });
    }
  }, [chapter]);

  // Notify parent when form becomes active
  useEffect(() => {
    onActivate?.(formData);
    return () => onDeactivate?.();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Chapter) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Handle scene form activation separately
  const handleSceneFormActivate = (sceneData: Partial<Scene>) => {
    // We don't want to activate the scene form in the AI Wizard
    // if the chapter form is already active
    if (!onActivate) {
      onActivate?.({
        ...formData,
        activeScene: sceneData
      });
    }
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="p-6 h-full overflow-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange('title')}
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

        {/* Embedded Scene Form */}
        {activeScene && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-4">Scene Details</h3>
            <SceneForm
              ref={sceneFormRef}
              scene={activeScene}
              onActivate={handleSceneFormActivate}
              onDeactivate={() => {}} // No-op to prevent conflicts with chapter form
              chapters={[chapter].filter(Boolean) as Chapter[]}
              // ... other scene form props
            />
          </div>
        )}

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
});

export default ChapterForm; 