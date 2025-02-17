import React from 'react';
import type { NovelCreate } from '../../services/api';

interface NovelFormProps {
  onSubmit: (data: NovelCreate) => void;
  onCancel: () => void;
}

export const NovelForm: React.FC<NovelFormProps> = ({ onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get('name') as string,
      summary: formData.get('summary') as string,
      description: formData.get('description') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-lg border p-2"
        />
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium mb-1">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={3}
          className="w-full rounded-lg border p-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="w-full rounded-lg border p-2"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Create Novel
        </button>
      </div>
    </form>
  );
}; 