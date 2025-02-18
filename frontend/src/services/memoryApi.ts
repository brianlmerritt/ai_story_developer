import { API_BASE_URL } from './api';
import type { Memory } from '../types';

type MemoryCreate = Omit<Memory, 'id'>;
type MemoryUpdate = Partial<MemoryCreate>;

export const memoryApi = {
  async list(): Promise<Memory[]> {
    const response = await fetch(`${API_BASE_URL}/memories/`);
    if (!response.ok) throw new Error('Failed to fetch memories');
    return response.json();
  },

  async create(memory: MemoryCreate): Promise<Memory> {
    const response = await fetch(`${API_BASE_URL}/memories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memory),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error('Memory creation failed:', error);
      throw new Error('Failed to create memory');
    }
    return response.json();
  },

  async update(id: number, memory: MemoryUpdate): Promise<Memory> {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memory),
    });
    if (!response.ok) throw new Error('Failed to update memory');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete memory');
  }
}; 