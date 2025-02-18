// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { SceneList } from './components/scene/SceneList';
import { SceneContent } from './components/scene/SceneContent';
import MainNav from './components/navigation/MainNav';
import { NavSection } from './types/navigation';
import { SceneFilters } from './components/scene/SceneFilters';
import type { Scene, Chapter } from './types';
import { Novel, NovelCreate, novelApi } from './services/api';
import { NovelForm } from './components/novel/NovelForm';
import { Plus } from 'lucide-react';
import { ChapterList } from './components/chapter/ChapterList';
import { CHAPTER_NAV_ITEMS } from './types/navigation';
import { CharacterView } from './components/character/CharacterView';
import { LocationView } from './components/location/LocationView';
import ChapterView from './components/chapter/ChapterView';
import { DiscoveryView } from './components/discovery/DiscoveryView';
import { MemoryView } from './components/memory/MemoryView';

interface SampleData {
  stories: Novel[];
  scenes: Scene[];
}

const SAMPLE_DATA: SampleData = {
  stories: [
    { id: 1, name: 'AGI Novel', summary: '', description: '', status: 'draft' }
  ],
  scenes: [
    { id: 1, title: 'Scene 1: Arrival', sequence: '1', description: '' },
    { id: 2, title: 'Scene 1a: Parking Lot', sequence: '1a', description: '' },
    { id: 3, title: 'Scene 2: Entry', sequence: '2', description: '' }
  ]
};

function App() {
  const [showStorySelector, setShowStorySelector] = useState(false);
  const [showSceneList, setShowSceneList] = useState(true);
  const [activeStory, setActiveStory] = useState<Novel>(SAMPLE_DATA.stories[0]);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [activeSection, setActiveSection] = useState<NavSection | null>(null);
  const [activeFilters, setActiveFilters] = useState<NavSection[]>([]);
  const [stories, setStories] = useState<Novel[]>([]);
  const [showNovelForm, setShowNovelForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  const activeSceneId: number | null = activeScene ? activeScene.id : null;

  useEffect(() => {
    loadNovels();
  }, []);

  const loadNovels = async () => {
    try {
      const novels = await novelApi.list();
      setStories(novels);
      if (novels.length > 0) {
        setActiveStory(novels[0]);
      }
    } catch (err) {
      setError('Failed to load novels');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNovel = async (data: NovelCreate) => {
    try {
      const novel = await novelApi.create(data);
      setStories(prev => [...prev, novel]);
      setShowNovelForm(false);
    } catch (err) {
      setError('Failed to create novel');
    }
  };

  const handleStorySelect = () => {
    setShowStorySelector(true);
  };

  const handleSceneSelect = (scene: Scene) => {
    setActiveScene(scene);
    setShowSceneList(false);
    setActiveSection('scenes');
  };

  const handleSceneUp = () => {
    setShowSceneList(true);
    setActiveScene(null);
  };

  const handleSceneUpdate = (updates: Partial<Scene>) => {
    if (activeScene) {
      setActiveScene({ ...activeScene, ...updates });
    }
  };

  const handleSectionSelect = (section: NavSection) => {
    setActiveSection(section);
    if (section === 'scenes') {
      setShowSceneList(true);
      setActiveScene(null);
    }
  };

  const handleFilterToggle = (filter: NavSection) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setActiveChapter(chapter);
    setShowSceneList(false);
    setActiveSection('chapters');
  };

  const handleChapterUp = () => {
    setShowSceneList(true);
    setActiveChapter(null);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Story Selector */}
      {showStorySelector && (
        <div className="w-64 border-r bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Stories</h2>
            <button
              onClick={() => setShowNovelForm(true)}
              className="p-1 rounded-lg hover:bg-gray-100"
              title="Create New Novel"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="space-y-2">
              {stories.map(story => (
                <button 
                  key={story.id}
                  className="w-full rounded-lg bg-white p-3 text-left shadow hover:bg-blue-50"
                  onClick={() => {
                    setActiveStory(story);
                    setShowStorySelector(false);
                  }}
                >
                  {story.name}
                </button>
              ))}
            </div>
          )}

          {showNovelForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-lg font-semibold mb-4">Create New Novel</h2>
                <NovelForm
                  onSubmit={handleCreateNovel}
                  onCancel={() => setShowNovelForm(false)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        <Header 
          story={activeStory.name}
          activeChapter={activeChapter?.title}
          onStorySelect={handleStorySelect}
          onChapterUp={activeChapter ? handleChapterUp : undefined}
        />

        {/* Main Navigation - shown when no chapter is active */}
        {!activeChapter && (
          <MainNav
            activeSection={activeSection}
            onSectionSelect={handleSectionSelect}
          />
        )}

        {/* Chapter Navigation - shown when a chapter is active */}
        {activeChapter && (
          <MainNav
            items={CHAPTER_NAV_ITEMS}
            activeSection={activeSection}
            onSectionSelect={handleSectionSelect}
          />
        )}

        <div className="flex h-[calc(100vh-8rem)]">
          {/* Character View */}
          {activeSection === 'characters' && (
            <CharacterView />
          )}

          {/* Location View */}
          {activeSection === 'locations' && (
            <LocationView />
          )}

          {/* Discovery View */}
          {activeSection === 'discoveries' && (
            <DiscoveryView />
          )}

          {/* Chapter View */}
          {activeSection === 'chapters' && (
            <ChapterView novelId={activeStory.id} />
          )}

          {/* Scene List */}
          {showSceneList && !activeScene && activeSection === 'scenes' && (
            <SceneList
              scenes={SAMPLE_DATA.scenes}
              activeScene={activeSceneId}
              onSceneSelect={handleSceneSelect}
              onAddScene={() => {}}
            />
          )}

          {/* Scene Content with Filters */}
          {activeScene && (
            <div className="flex flex-1">
              <SceneContent
                scene={activeScene}
                onUpdate={handleSceneUpdate}
              />
              <SceneFilters
                activeFilters={activeFilters}
                onFilterToggle={handleFilterToggle}
              />
            </div>
          )}

          {/* Memory View */}
          {activeSection === 'memories' && (
            <MemoryView />
          )}

          {/* Other Section Content */}
          {!activeScene && activeSection && !['scenes', 'characters', 'locations', 'chapters'].includes(activeSection) && (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              {/* Content for other sections will go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;