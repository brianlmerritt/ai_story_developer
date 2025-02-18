import { API_BASE_URL } from './api';
import type { Scene } from '../types';

type SceneCreate = Omit<Scene, 'id'>;
type SceneUpdate = Partial<SceneCreate>;

export const sceneApi = {
  async list(): Promise<Scene[]> {
    const response = await fetch(`${API_BASE_URL}/scenes/`);
    if (!response.ok) throw new Error('Failed to fetch scenes');
    return response.json();
  },

  async create(scene: SceneCreate): Promise<Scene> {
    console.log('Creating scene:', scene);
    const response = await fetch(`${API_BASE_URL}/scenes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scene),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error('Scene creation failed:', error);
      throw new Error('Failed to create scene');
    }
    return response.json();
  },

  async update(id: number, scene: SceneUpdate): Promise<Scene> {
    const response = await fetch(`${API_BASE_URL}/scenes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scene),
    });
    if (!response.ok) throw new Error('Failed to update scene');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/scenes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete scene');
  }
}; 