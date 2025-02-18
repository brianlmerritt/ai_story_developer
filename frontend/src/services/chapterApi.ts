import { API_BASE_URL } from './api';
import type { Chapter } from '../types';

type ChapterCreate = Omit<Chapter, 'id'>;
type ChapterUpdate = Partial<ChapterCreate>;

export const chapterApi = {
  async list(): Promise<Chapter[]> {
    const response = await fetch(`${API_BASE_URL}/chapters/`);
    if (!response.ok) throw new Error('Failed to fetch chapters');
    return response.json();
  },

  async create(chapter: ChapterCreate): Promise<Chapter> {
    // debugging: log chapter API request
    console.log('Sending chapter create request:', chapter);
    const response = await fetch(`${API_BASE_URL}/chapters/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chapter),
    });
    if (!response.ok) {
      const error = await response.text();
      // debugging: log chapter API error
      console.error('Chapter creation failed:', error);
      throw new Error('Failed to create chapter');
    }
    return response.json();
  },

  async update(id: string, chapter: ChapterUpdate): Promise<Chapter> {
    const response = await fetch(`${API_BASE_URL}/chapters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chapter),
    });
    if (!response.ok) throw new Error('Failed to update chapter');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chapters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete chapter');
  }
}; 