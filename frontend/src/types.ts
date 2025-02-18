export interface Chapter {
  id: number;
  title: string;
  summary?: string;
  sequence?: string;
  description?: string;
  novel_id: number;
  status?: string;
}

export interface Scene {
  id: number;
  name: string;
  content?: string;
  summary?: string;
  sequence?: string;
  chapter_id?: number;
  status?: string;
  description?: string;
  scene_beats?: string;
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
  status: Status;
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  novel_id: number;
  summary?: string;
  key_details_and_quirks?: string;
}

export interface Discovery {
  id: number;
  name: string;
  summary?: string;
  description?: string;
  key_details_and_quirks?: string;
  foreshadow_chapter_id?: number;
  reveal_chapter_id?: number;
  characters?: Record<string, number>;  // Dictionary of nickname:character_id
  locations?: Record<string, number>;   // Dictionary of name:location_id
}

export interface Memory {
  id: number;
  title: string;
  summary: string;
  description: string;
  key_details_and_quirks: string;
  chapter_id?: number;
  scene_id?: number;
  characters: Record<string, number>;  // nickname -> id mapping
  locations: Record<string, number>;   // name -> id mapping
  discoveries: Record<string, number>; // name -> id mapping
  status: string;
} 