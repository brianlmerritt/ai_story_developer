import { API_BASE_URL } from './api';
import type { Location } from '../types';

type LocationCreate = Omit<Location, 'id'>;
type LocationUpdate = Partial<LocationCreate>;

export const locationApi = {
  async list(): Promise<Location[]> {
    const response = await fetch(`${API_BASE_URL}/locations/`);
    if (!response.ok) throw new Error('Failed to fetch locations');
    return response.json();
  },

  async create(location: LocationCreate): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/locations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    if (!response.ok) throw new Error('Failed to create location');
    return response.json();
  },

  async update(id: number, location: LocationUpdate): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    if (!response.ok) throw new Error('Failed to update location');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete location');
  }
}; 