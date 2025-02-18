import React, { useState, useEffect } from 'react';
import { DiscoveryList } from './DiscoveryList';
import { DiscoveryForm } from './DiscoveryForm';
import { discoveryApi } from '../../services/discoveryApi';
import type { Discovery } from '../../types';

export const DiscoveryView: React.FC = () => {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [activeDiscovery, setActiveDiscovery] = useState<Discovery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDiscoveries();
  }, []);

  const loadDiscoveries = async () => {
    try {
      const data = await discoveryApi.list();
      setDiscoveries(data);
    } catch (err) {
      setError('Failed to load discoveries');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscovery = async (data: Partial<Discovery>) => {
    try {
      const newDiscovery = await discoveryApi.create(data as Omit<Discovery, 'id'>);
      setDiscoveries(prev => [...prev, newDiscovery]);
      setActiveDiscovery(newDiscovery);
    } catch (err) {
      setError('Failed to create discovery');
    }
  };

  const handleUpdateDiscovery = async (data: Partial<Discovery>) => {
    if (!activeDiscovery) return;
    try {
      console.log('Updating discovery with data:', data);
      const updatedDiscovery = await discoveryApi.update(activeDiscovery.id, {
        ...data,
        status: data.status || activeDiscovery.status || 'draft',
      });
      console.log('Got updated discovery response:', updatedDiscovery);
      setDiscoveries(prev => {
        console.log('Updating discoveries state:', prev.map(disc => 
          disc.id === updatedDiscovery.id ? updatedDiscovery : disc
        ));
        return prev.map(disc => 
          disc.id === updatedDiscovery.id ? updatedDiscovery : disc
        );
      });
      setActiveDiscovery(updatedDiscovery);
    } catch (err) {
      console.error('Failed to update discovery:', err);
      setError('Failed to update discovery');
    }
  };

  const handleDeleteDiscovery = async (id: number) => {
    try {
      await discoveryApi.delete(id);
      setDiscoveries(prev => prev.filter(disc => disc.id !== id));
      setActiveDiscovery(null);
    } catch (err) {
      setError('Failed to delete discovery');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-full w-full">
      <div className="w-1/4 min-w-[16rem]">
        <DiscoveryList
          discoveries={discoveries}
          activeDiscovery={activeDiscovery?.id ?? null}
          onDiscoverySelect={setActiveDiscovery}
          onAddDiscovery={() => setActiveDiscovery(null)}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <DiscoveryForm
          discovery={activeDiscovery}
          onSubmit={activeDiscovery ? handleUpdateDiscovery : handleCreateDiscovery}
          onCancel={activeDiscovery ? () => setActiveDiscovery(null) : undefined}
        />
      </div>
    </div>
  );
};

export default DiscoveryView; 