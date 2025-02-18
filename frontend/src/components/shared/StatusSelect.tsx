import React from 'react';

export type Status = 'draft' | 'review' | 'published' | 'deleted' | '';

interface StatusSelectProps {
  value: Status;
  onChange: (status: Status) => void;
  className?: string;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({ value, onChange, className = '' }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Status)}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
    >
      <option value="">Select status...</option>
      <option value="draft">Draft</option>
      <option value="review">Review</option>
      <option value="published">Published</option>
      <option value="deleted">Deleted</option>
    </select>
  );
}; 