import React from 'react';
import { Plus } from 'lucide-react';
import type { Character } from '../../types';

interface CharacterListProps {
  characters: Character[];
  activeCharacter: number | null;
  onCharacterSelect: (character: Character) => void;
  onAddCharacter: () => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  activeCharacter,
  onCharacterSelect,
  onAddCharacter,
}) => (
  <div className="h-full border-r bg-gray-50">
    <div className="flex items-center justify-between p-4 border-b">
      <button
        onClick={onAddCharacter}
        className="p-1 rounded-lg hover:bg-gray-100"
        title="Add Character"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
    <div className="p-4 space-y-2 overflow-auto">
      {characters.map(character => (
        <button
          key={character.id}
          className={`w-full rounded-lg p-3 text-left shadow hover:bg-blue-50
            ${activeCharacter === character.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
          onClick={() => onCharacterSelect(character)}
        >
          {character.name}
        </button>
      ))}
    </div>
  </div>
);

export default CharacterList; 