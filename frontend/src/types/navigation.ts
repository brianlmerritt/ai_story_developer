// src/types/navigation.ts
import { MessageSquare, MenuSquare, Users, MapPin, Lightbulb, Home } from 'lucide-react';

export type NavSection = 'brainstorm' | 'scenes' | 'characters' | 'locations' | 'discoveries' | 'memories';

export const NAV_ITEMS = [
  { id: 'brainstorm', label: 'Brainstorm', icon: MessageSquare },
  { id: 'scenes', label: 'Scenes', icon: MenuSquare },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'discoveries', label: 'Discoveries', icon: Lightbulb },
  { id: 'memories', label: 'Memories', icon: Home }
] as const;