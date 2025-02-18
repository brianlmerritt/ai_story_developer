import React, { useState, useEffect } from 'react';
import { ChapterList } from './ChapterList';
import { ChapterForm } from './ChapterForm';
import { SceneForm } from '../scene/SceneForm';
import { chapterApi } from '../../services/chapterApi';
import { sceneApi } from '../../services/sceneApi';
import { characterApi } from '../../services/characterApi';
import { locationApi } from '../../services/locationApi';
import { discoveryApi } from '../../services/discoveryApi';
import { memoryApi } from '../../services/memoryApi';
import type { Chapter, Scene, Character, Location, Discovery, Memory } from '../../types';

export interface ChapterViewProps {
  novelId: number;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ novelId }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    loadChapters();
    loadScenes();
    loadRelatedData();
  }, []);

  const loadChapters = async () => {
    try {
      const data = await chapterApi.list();
      setChapters(data);
    } catch (err) {
      setError('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const loadScenes = async () => {
    try {
      const data = await sceneApi.list();
      setScenes(data);
    } catch (err) {
      console.error('Failed to load scenes:', err);
    }
  };

  const loadRelatedData = async () => {
    try {
      const [chars, locs, discs, mems] = await Promise.all([
        characterApi.list(),
        locationApi.list(),
        discoveryApi.list(),
        memoryApi.list()
      ]);
      
      setCharacters(chars);
      setLocations(locs);
      setDiscoveries(discs);
      setMemories(mems);
    } catch (err) {
      console.error('Failed to load related data:', err);
    }
  };

  const handleCreateChapter = async (data: Partial<Chapter>) => {
    try {
      const newChapter = await chapterApi.create({
        ...data,
        novel_id: novelId
      } as Omit<Chapter, 'id'>);
      setChapters(prev => [...prev, newChapter]);
      setActiveChapter(newChapter);
    } catch (err) {
      console.error('Error creating chapter:', err);
      setError('Failed to create chapter');
    }
  };

  const handleUpdateChapter = async (data: Partial<Chapter>) => {
    if (!activeChapter) return;
    try {
      const updatedChapter = await chapterApi.update(activeChapter.id, data);
      setChapters(prev => prev.map(chap => 
        chap.id === updatedChapter.id ? updatedChapter : chap
      ));
      setActiveChapter(updatedChapter);
    } catch (err) {
      setError('Failed to update chapter');
    }
  };

  const handleAddNewScene = () => {
    setActiveScene(null);
  };

  const handleCreateScene = async (data: Partial<Scene>) => {
    if (!activeChapter) return;
    try {
      console.log('Creating new scene for chapter:', activeChapter.id);
      const newScene = await sceneApi.create({
        ...data,
        chapter_id: activeChapter.id,
        status: 'draft'
      } as Omit<Scene, 'id'>);
      console.log('Created scene:', newScene);
      setScenes(prev => [...prev, newScene]);
      setActiveScene(newScene);
    } catch (err) {
      console.error('Error creating scene:', err);
      setError('Failed to create scene');
    }
  };

  const handleUpdateScene = async (data: Partial<Scene>) => {
    if (!activeScene) return;
    try {
      const updatedScene = await sceneApi.update(activeScene.id, data);
      setScenes(prev => prev.map(scene => 
        scene.id === updatedScene.id ? updatedScene : scene
      ));
      setActiveScene(updatedScene);
    } catch (err) {
      setError('Failed to update scene');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-full w-full">
      <div className="w-1/4 min-w-[16rem]">
        <ChapterList
          chapters={chapters}
          scenes={scenes}
          activeChapter={activeChapter?.id ?? null}
          activeScene={activeScene?.id ?? null}
          onChapterSelect={setActiveChapter}
          onAddChapter={() => setActiveChapter(null)}
          onSceneSelect={setActiveScene}
          onAddScene={handleAddNewScene}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-8">
          {/* Chapter Form */}
          <div>
            <ChapterForm
              chapter={activeChapter}
              novelId={novelId}
              onSubmit={activeChapter ? handleUpdateChapter : handleCreateChapter}
              onCancel={activeChapter ? () => setActiveChapter(null) : undefined}
            />
          </div>

          {/* Scene Form - only show when a chapter is selected */}
          {activeChapter && (
            <>
              <hr className="border-gray-200" />
              <div>
                <h2 className="text-lg font-medium mb-4">Scene Details</h2>
                <SceneForm
                  scene={activeScene}
                  chapters={chapters}
                  characters={characters}
                  locations={locations}
                  discoveries={discoveries}
                  memories={memories}
                  onSubmit={activeScene ? handleUpdateScene : handleCreateScene}
                  onCancel={() => setActiveScene(null)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterView; 