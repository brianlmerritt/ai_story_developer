// frontend/src/components/scene/SceneList.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import type { Scene } from '../../types';

interface SceneListProps {
  scenes: Scene[];
  activeScene: number | null;  // Changed from string | null
  onSceneSelect: (scene: Scene) => void;
  onAddScene: () => void;
}

export const SceneList: React.FC<SceneListProps> = ({
  scenes,
  activeScene,
  onSceneSelect,
  onAddScene,
}) => {
  console.log('SceneList rendering with scenes:', scenes);  // Debug point 1
  return (
    <div className="w-64 border-r bg-gray-50 p-4">
      <div className="space-y-2">
        {scenes.map(scene => (
          <button 
            key={scene.id}
            className={`w-full rounded-lg p-3 text-left shadow hover:bg-blue-50
              ${activeScene === scene.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
            onClick={() => {
              console.log('Scene button clicked:', scene);  // Debug point 2
              onSceneSelect(scene);
            }}
          >
            {scene.title}
          </button>
        ))}
        <button 
          className="w-full rounded-lg border border-dashed p-3 text-gray-500 hover:bg-gray-50"
          onClick={onAddScene}
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Insert Scene
        </button>
      </div>
    </div>
  );
};