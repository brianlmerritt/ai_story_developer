import { API_BASE_URL } from './api';

export interface Location {
  id: number;
  name: string;
  // Add other location fields as needed
}

export const locationApi = {
  async list(): Promise<Location[]> {
    const response = await fetch(`${API_BASE_URL}/locations/`);
    if (!response.ok) throw new Error('Failed to fetch locations');
    return response.json();
  }
}; 