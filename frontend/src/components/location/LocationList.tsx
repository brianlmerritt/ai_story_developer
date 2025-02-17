import React from 'react';
import { Plus } from 'lucide-react';
import type { Location } from '../../types';

interface LocationListProps {
  locations: Location[];
  activeLocation: number | null;
  onLocationSelect: (location: Location) => void;
  onAddLocation: () => void;
}

export const LocationList: React.FC<LocationListProps> = ({
  locations,
  activeLocation,
  onLocationSelect,
  onAddLocation,
}) => (
  <div className="h-full border-r bg-gray-50">
    <div className="flex items-center justify-between p-4 border-b">
      <button
        onClick={onAddLocation}
        className="p-1 rounded-lg hover:bg-gray-100"
        title="Add Location"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
    <div className="p-4 space-y-2 overflow-auto">
      {locations.map(location => (
        <button
          key={location.id}
          className={`w-full rounded-lg p-3 text-left shadow hover:bg-blue-50
            ${activeLocation === location.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
          onClick={() => onLocationSelect(location)}
        >
          {location.name}
        </button>
      ))}
    </div>
  </div>
); 