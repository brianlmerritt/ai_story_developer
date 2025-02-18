import React, { useState, useEffect } from 'react';
import { MemoryForm } from './MemoryForm';
import { memoryApi } from '../../services/memoryApi';
import { chapterApi } from '../../services/chapterApi';
import type { Memory, Chapter } from '../../types';
import { Plus } from 'lucide-react';
import { characterApi } from '../../services/characterApi';
import { locationApi } from '../../services/locationApi';
import { discoveryApi } from '../../services/discoveryApi';

export const MemoryView: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characters, setCharacters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [discoveries, setDiscoveries] = useState([]);

  useEffect(() => {
    Promise.all([
      loadMemories(),
      loadChapters(),
      loadCharacters(),
      loadLocations(),
      loadDiscoveries()
    ]).finally(() => setLoading(false));
  }, []);

  const loadMemories = async () => {
    try {
      const data = await memoryApi.list();
      setMemories(data);
    } catch (err) {
      setError('Failed to load memories');
    }
  };

  const loadChapters = async () => {
    try {
      const data = await chapterApi.list();
      setChapters(data);
    } catch (err) {
      setError('Failed to load chapters');
    }
  };

  const loadCharacters = async () => {
    try {
      const data = await characterApi.list();
      setCharacters(data);
    } catch (err) {
      setError('Failed to load characters');
    }
  };

  const loadLocations = async () => {
    try {
      const data = await locationApi.list();
      setLocations(data);
    } catch (err) {
      setError('Failed to load locations');
    }
  };

  const loadDiscoveries = async () => {
    try {
      const data = await discoveryApi.list();
      setDiscoveries(data);
    } catch (err) {
      setError('Failed to load discoveries');
    }
  };

  const handleCreateMemory = async (data: Partial<Memory>) => {
    try {
      const newMemory = await memoryApi.create(data as Omit<Memory, 'id'>);
      setMemories(prev => [...prev, newMemory]);
      setActiveMemory(null);
    } catch (err) {
      setError('Failed to create memory');
    }
  };

  const handleUpdateMemory = async (data: Partial<Memory>) => {
    if (!activeMemory) return;
    try {
      const updatedMemory = await memoryApi.update(activeMemory.id, data);
      setMemories(prev => prev.map(memory => 
        memory.id === updatedMemory.id ? updatedMemory : memory
      ));
      setActiveMemory(null);
    } catch (err) {
      setError('Failed to update memory');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-full w-full">
      {/* Memory List */}
      <div className="w-1/4 min-w-[16rem]">
        <div className="h-full border-r bg-gray-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">Memories</h2>
            <button
              onClick={() => setActiveMemory(null)}
              className="p-1 rounded-lg hover:bg-gray-100"
              title="Add Memory"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-2 overflow-auto">
            {memories.map(memory => (
              <button
                key={memory.id}
                className={`w-full rounded-lg p-3 text-left shadow hover:bg-blue-50
                  ${activeMemory?.id === memory.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                onClick={() => setActiveMemory(memory)}
              >
                {memory.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Form */}
      <div className="flex-1 overflow-auto">
        <MemoryForm
          memory={activeMemory}
          chapters={chapters}
          characters={characters}
          locations={locations}
          discoveries={discoveries}
          onSubmit={activeMemory ? handleUpdateMemory : handleCreateMemory}
          onCancel={activeMemory ? () => setActiveMemory(null) : undefined}
        />
      </div>
    </div>
  );
};

export default MemoryView; 