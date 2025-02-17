// src/components/scene/SceneFilters.tsx
import React from 'react';
import { NavSection, NAV_ITEMS } from '../../types/navigation';

interface SceneFiltersProps {
  activeFilters: NavSection[];
  onFilterToggle: (filter: NavSection) => void;
}

export const SceneFilters: React.FC<SceneFiltersProps> = ({ 
  activeFilters, 
  onFilterToggle 
}) => (
  <div className="w-48 border-l bg-gray-50">
    {NAV_ITEMS.filter(item => item.id !== 'scenes').map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        className={`flex w-full items-center gap-2 p-4 hover:bg-gray-100
          ${activeFilters.includes(id as NavSection) ? 'bg-gray-100' : ''}`}
        onClick={() => onFilterToggle(id as NavSection)}
      >
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </button>
    ))}
  </div>
);