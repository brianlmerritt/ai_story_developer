// src/components/shared/ListDetailView.tsx
import React from 'react';

interface ListDetailViewProps<T> {
  items: T[];
  activeItem?: T;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  renderDetail: (item: T) => React.ReactNode;
}

export function ListDetailView<T extends { id: string }>({
  items,
  activeItem,
  onSelect,
  renderItem,
  renderDetail,
}: ListDetailViewProps<T>) {
  return (
    <div className="flex min-h-[300px]">
      <div className="w-64 border-r bg-gray-50 p-4">
        <div className="space-y-2">
          {items.map(item => (
            <button
              key={item.id}
              className={`w-full rounded-lg p-3 text-left shadow hover:bg-blue-50
                ${activeItem?.id === item.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
              onClick={() => onSelect(item)}
            >
              {renderItem(item)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 p-4">
        {activeItem ? renderDetail(activeItem) : (
          <div className="text-gray-500 text-center mt-8">
            Select an item to view details
          </div>
        )}
      </div>
    </div>
  );
}