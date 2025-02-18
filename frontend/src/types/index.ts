// frontend/src/types/index.ts
export interface Story {
    id: string;
    title: string;
  }
  
  export interface Chapter {
    id: string;
    title: string;
    summary?: string;
    sequence?: string;
    description?: string;
    novel_id: number;
    status?: string;
  }
  
  export interface Scene {
    id: string;
    title: string;
    sequence: string;
    description?: string;
    scene_beats?: string;
    directions?: string;
    key_details_and_quirks?: string;
    chapter_id?: string;
    characters?: Record<string, number>;
    locations?: Record<string, number>;
  }
  
  export interface Character {
    id: number;
    name: string;
    nickname?: string;
    summary?: string;
    personality?: string;
    description?: string;
    dialogue_style?: string;
    key_details_and_quirks?: string;
  }
  
  export interface Location {
    id: number;
    name: string;
    summary?: string;
    description?: string;
    key_details_and_quirks?: string;
  }
  
  export interface Discovery {
    id: number;
    title: string;
    content: string;
  }
  
  export interface Memory {
    id: number;
    title: string;
    content: string;
    relatedCharacters: number[];
  }