export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.185:9999/api';

export interface NovelCreate {
  name: string;
  summary: string;
  description?: string;
  status?: string;
}

export interface Novel {
  id: number;
  name: string;
  summary: string;
  description: string;
  status: string;
}

export const novelApi = {
  async list(): Promise<Novel[]> {
    const response = await fetch(`${API_BASE_URL}/novels`);
    if (!response.ok) throw new Error('Failed to fetch novels');
    return response.json();
  },

  async create(novel: NovelCreate): Promise<Novel> {
    const response = await fetch(`${API_BASE_URL}/novels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novel),
    });
    if (!response.ok) throw new Error('Failed to create novel');
    return response.json();
  }
}; 