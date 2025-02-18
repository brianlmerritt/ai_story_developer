import React from 'react';
import { Plus } from 'lucide-react';
import type { Discovery } from '../../types';

interface DiscoveryListProps {
  discoveries: Discovery[];
  activeDiscovery: number | null;
  onDiscoverySelect: (discovery: Discovery) => void;
  onAddDiscovery: () => void;
}

export const DiscoveryList: React.FC<DiscoveryListProps> = ({
  discoveries,
  activeDiscovery,
  onDiscoverySelect,
  onAddDiscovery,
}) => (
  <div className="h-full border-r bg-gray-50">
    <div className="flex items-center justify-between p-4 border-b">
      <button
        onClick={onAddDiscovery}
        className="p-1 rounded-lg hover:bg-gray-100"
        title="Add Discovery"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
    <div className="p-4 space-y-2 overflow-auto">
      {discoveries.map(discovery => (
        <button
          key={discovery.id}
          className={`w-full rounded-lg p-3 text-left shadow hover:bg-blue-50
            ${activeDiscovery === discovery.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
          onClick={() => onDiscoverySelect(discovery)}
        >
          {discovery.name}
        </button>
      ))}
    </div>
  </div>
); 