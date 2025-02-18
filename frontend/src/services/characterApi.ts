import { API_BASE_URL } from './api';
import type { Character } from '../types';

type CharacterCreate = Omit<Character, 'id'>;
type CharacterUpdate = Partial<CharacterCreate>;

export const characterApi = {
  async list(): Promise<Character[]> {
    const response = await fetch(`${API_BASE_URL}/characters/`);
    if (!response.ok) throw new Error('Failed to fetch characters');
    return response.json();
  },

  async create(character: CharacterCreate): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/characters/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    if (!response.ok) throw new Error('Failed to create character');
    return response.json();
  },

  async update(id: number, character: CharacterUpdate): Promise<Character> {
    console.log('Sending character update:', character);
    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error('Character update failed:', error);
      throw new Error('Failed to update character');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete character');
  }
}; 