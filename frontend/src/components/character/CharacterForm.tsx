import React, { useState, useEffect } from 'react';
import type { Character } from '../../types';
import { AutoResizeTextarea } from '../shared/AutoResizeTextarea';
import { StatusSelect, type Status } from '../shared/StatusSelect';

interface CharacterFormProps {
  character?: Character | null;
  onSubmit: (data: Partial<Character>) => void;
  onCancel?: () => void;
}

export const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Character>>({
    name: '',
    nickname: '',
    summary: '',
    personality: '',
    description: '',
    dialogue_style: '',
    key_details_and_quirks: '',
    status: 'draft' as Status,
    ...character,
  });

  // Update form data when character changes
  useEffect(() => {
    if (character) {
      setFormData({
        ...character,
        status: character.status || 'draft' as Status,
      });
    } else {
      setFormData({
        name: '',
        nickname: '',
        summary: '',
        personality: '',
        description: '',
        dialogue_style: '',
        key_details_and_quirks: '',
        status: 'draft' as Status,
      });
    }
  }, [character]);

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
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
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
          <label className="block text-sm font-medium mb-1">Nickname</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname || ''}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
          />
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
          <label className="block text-sm font-medium mb-1">Personality</label>
          <AutoResizeTextarea
            name="personality"
            value={formData.personality || ''}
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
          <label className="block text-sm font-medium mb-1">Dialogue Style</label>
          <AutoResizeTextarea
            name="dialogue_style"
            value={formData.dialogue_style || ''}
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
            {character ? 'Update' : 'Create'} Character
          </button>
        </div>
      </div>
    </form>
  );
}; 