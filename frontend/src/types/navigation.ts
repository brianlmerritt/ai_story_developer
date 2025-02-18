// src/types/navigation.ts
import { MenuSquare, Users, MapPin, Lightbulb, Home, Brain } from 'lucide-react';

export type NavSection = 'chapters' | 'scenes' | 'characters' | 'locations' | 'discoveries' | 'memories';

export const NAV_ITEMS = [
  { id: 'chapters', label: 'Chapters', icon: MenuSquare },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'discoveries', label: 'Discoveries', icon: Lightbulb },
  { id: 'memories', label: 'Memories', icon: Brain }
] as const;

// For use in chapter view
export const CHAPTER_NAV_ITEMS = [
  { id: 'scenes', label: 'Scenes', icon: MenuSquare },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'discoveries', label: 'Discoveries', icon: Lightbulb },
  { id: 'memories', label: 'Memories', icon: Home }
] as const;