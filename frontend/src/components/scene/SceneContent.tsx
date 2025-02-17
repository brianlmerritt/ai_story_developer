// frontend/src/components/scene/SceneContent.tsx
import React, { useState } from 'react';
import type { Scene } from '../../types';

interface SceneContentProps {
  scene: Scene;
  onUpdate: (sceneData: Partial<Scene>) => void;
}

export const SceneContent: React.FC<SceneContentProps> = ({
  scene,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'input' | 'analysis' | 'output'>('input');

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b bg-white">
        {(['input', 'analysis', 'output'] as const).map(tab => (
          <button
            key={tab}
            className={`px-6 py-3 font-medium capitalize
              ${activeTab === tab 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'input' && (
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Scene Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Scene Description</label>
                <textarea 
                  className="w-full rounded-lg border p-2"
                  rows={4}
                  placeholder="Enter scene description..."
                  value={scene.description || ''}
                  onChange={e => onUpdate({ description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scene Directions</label>
                <textarea 
                  className="w-full rounded-lg border p-2"
                  rows={4}
                  placeholder="Enter scene directions..."
                  value={scene.directions || ''}
                  onChange={e => onUpdate({ directions: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'analysis' && (
          <div className="rounded-lg border p-4">
            Analysis content...
          </div>
        )}
        {activeTab === 'output' && (
          <div className="rounded-lg border p-4">
            Generated scene content...
          </div>
        )}
      </div>
    </div>
  );
};