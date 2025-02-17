// src/components/navigation/MainNav.tsx
import React from 'react';
import { NavSection, NAV_ITEMS } from '../../types/navigation';

interface MainNavProps {
  activeSection: NavSection | null;
  onSectionSelect: (section: NavSection) => void;
}

export const MainNav: React.FC<MainNavProps> = ({ activeSection, onSectionSelect }) => (
  <div className="grid grid-cols-6 gap-2 p-4 bg-white border-b">
    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        className={`flex items-center justify-center gap-2 p-2 rounded-lg 
          ${activeSection === id 
            ? 'bg-blue-50 text-blue-600' 
            : 'hover:bg-gray-50'}`}
        onClick={() => onSectionSelect(id as NavSection)}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </button>
    ))}
  </div>
);

export default MainNav;