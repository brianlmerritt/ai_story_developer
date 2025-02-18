import { API_BASE_URL } from './api';

export interface Discovery {
  id: number;
  name: string;
  // Add other discovery fields as needed
}

export const discoveryApi = {
  async list(): Promise<Discovery[]> {
    const response = await fetch(`${API_BASE_URL}/discoveries/`);
    if (!response.ok) throw new Error('Failed to fetch discoveries');
    return response.json();
  },

  async create(discovery: DiscoveryCreate): Promise<Discovery> {
    const response = await fetch(`${API_BASE_URL}/discoveries/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discovery),
    });
    if (!response.ok) throw new Error('Failed to create discovery');
    return response.json();
  },

  async update(id: number, discovery: DiscoveryUpdate): Promise<Discovery> {
    console.log('Sending discovery update:', discovery);
    const response = await fetch(`${API_BASE_URL}/discoveries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discovery),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error('Discovery update failed:', error);
      throw new Error('Failed to update discovery');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/discoveries/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete discovery');
  }
}; 