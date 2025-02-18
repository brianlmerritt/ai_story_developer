import React, { useState, useEffect } from 'react';
import { LocationList } from './LocationList';
import { LocationForm } from './LocationForm';
import { locationApi } from '../../services/locationApi';
import type { Location } from '../../types';

export const LocationView: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await locationApi.list();
      setLocations(data);
    } catch (err) {
      setError('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocation = async (data: Partial<Location>) => {
    try {
      const newLocation = await locationApi.create(data as Omit<Location, 'id'>);
      setLocations(prev => [...prev, newLocation]);
      setActiveLocation(newLocation);
    } catch (err) {
      setError('Failed to create location');
    }
  };

  const handleUpdateLocation = async (data: Partial<Location>) => {
    if (!activeLocation) return;
    try {
      console.log('Updating location with data:', data);
      const updatedLocation = await locationApi.update(activeLocation.id, {
        ...data,
        status: data.status || activeLocation.status || 'draft',
      });
      console.log('Got updated location response:', updatedLocation);
      setLocations(prev => {
        console.log('Updating locations state:', prev.map(loc => 
          loc.id === updatedLocation.id ? updatedLocation : loc
        ));
        return prev.map(loc => 
          loc.id === updatedLocation.id ? updatedLocation : loc
        );
      });
      setActiveLocation(updatedLocation);
    } catch (err) {
      console.error('Failed to update location:', err);
      setError('Failed to update location');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-full w-full">
      <div className="w-1/4 min-w-[16rem]">
        <LocationList
          locations={locations}
          activeLocation={activeLocation?.id ?? null}
          onLocationSelect={setActiveLocation}
          onAddLocation={() => setActiveLocation(null)}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <LocationForm
          location={activeLocation}
          onSubmit={activeLocation ? handleUpdateLocation : handleCreateLocation}
          onCancel={activeLocation ? () => setActiveLocation(null) : undefined}
        />
      </div>
    </div>
  );
}; 