import React, { useState, useEffect } from 'react';
import type { Location } from '../../types';
import { AutoResizeTextarea } from '../shared/AutoResizeTextarea';

interface LocationFormProps {
  location?: Location | null;
  onSubmit: (data: Partial<Location>) => void;
  onCancel?: () => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({
  location,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    summary: '',
    description: '',
    key_details_and_quirks: '',
  });

  useEffect(() => {
    if (location) {
      setFormData(location);
    } else {
      setFormData({
        name: '',
        summary: '',
        description: '',
        key_details_and_quirks: '',
      });
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Location) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 h-full overflow-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <div>
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
            {location ? 'Update' : 'Create'} Location
          </button>
        </div>
      </div>
    </form>
  );
}; 