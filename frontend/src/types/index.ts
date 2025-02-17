// frontend/src/types/index.ts
export interface Story {
    id: string;
    title: string;
  }
  
  export interface Scene {
    id: string;
    title: string;
    sequence: string;
    description?: string;
    directions?: string;
  }
  
  export interface Character {
    id: string;
    name: string;
    attributes: {
      age?: number;
      occupation?: string;
      background?: string;
    };
  }
  
  export interface Location {
    id: string;
    name: string;
    description: string;
  }
  
  export interface Discovery {
    id: string;
    title: string;
    content: string;
  }
  
  export interface Memory {
    id: string;
    title: string;
    content: string;
    relatedCharacters: string[];
  }