import React, { useState, useEffect } from 'react';
import { CharacterList } from './CharacterList';
import { CharacterForm } from './CharacterForm';
import { characterApi } from '../../services/characterApi';
import type { Character } from '../../types';

export const CharacterView: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const data = await characterApi.list();
      setCharacters(data);
    } catch (err) {
      setError('Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async (data: Partial<Character>) => {
    try {
      const newCharacter = await characterApi.create(data as Omit<Character, 'id'>);
      setCharacters(prev => [...prev, newCharacter]);
      setActiveCharacter(newCharacter);
    } catch (err) {
      setError('Failed to create character');
    }
  };

  const handleUpdateCharacter = async (data: Partial<Character>) => {
    if (!activeCharacter) return;
    try {
      console.log('Updating character with data:', data);
      const updatedCharacter = await characterApi.update(activeCharacter.id, {
        ...data,
        status: data.status || activeCharacter.status || 'draft',
      });
      setCharacters(prev => prev.map(char => 
        char.id === updatedCharacter.id ? updatedCharacter : char
      ));
      setActiveCharacter(updatedCharacter);
    } catch (err) {
      console.error('Failed to update character:', err);
      setError('Failed to update character');
    }
  };

  const handleDeleteCharacter = async (id: number) => {
    try {
      await characterApi.delete(id);
      setCharacters(prev => prev.filter(char => char.id !== id));
      setActiveCharacter(null);
    } catch (err) {
      setError('Failed to delete character');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-full w-full">
      <div className="w-1/4 min-w-[16rem]">
        <CharacterList
          characters={characters}
          activeCharacter={activeCharacter?.id ?? null}
          onCharacterSelect={setActiveCharacter}
          onAddCharacter={() => setActiveCharacter(null)}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <CharacterForm
          character={activeCharacter}
          onSubmit={activeCharacter ? handleUpdateCharacter : handleCreateCharacter}
          onCancel={activeCharacter ? () => setActiveCharacter(null) : undefined}
        />
      </div>
    </div>
  );
};

export default CharacterView; 