// src/components/navigation/MainNav.tsx
import React from 'react';
import { NavSection, NAV_ITEMS } from '../../types/navigation';
import { LucideIcon } from 'lucide-react';

type NavItem = {
  id: NavSection;
  label: string;
  icon: LucideIcon;
};

interface MainNavProps {
  activeSection: NavSection | null;
  onSectionSelect: (section: NavSection) => void;
  items?: readonly NavItem[];
}

export const MainNav: React.FC<MainNavProps> = ({ 
  activeSection, 
  onSectionSelect,
  items = NAV_ITEMS 
}) => (
  <div className="grid grid-cols-6 gap-2 p-4 bg-white border-b">
    {items.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        className={`flex items-center justify-center gap-2 p-2 rounded-lg 
          ${activeSection === id 
            ? 'bg-blue-50 text-blue-600' 
            : 'hover:bg-gray-50'}`}
        onClick={() => onSectionSelect(id)}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </button>
    ))}
  </div>
);

export default MainNav;