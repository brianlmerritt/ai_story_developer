// src/App.tsx
import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { SceneList } from './components/scene/SceneList';
import { SceneContent } from './components/scene/SceneContent';
import MainNav from './components/navigation/MainNav';
import { NavSection } from './types/navigation';
import { SceneFilters } from './components/scene/SceneFilters';
import type { Story, Scene } from './types';

interface SampleData {
  stories: Story[];
  scenes: Scene[];
}

const SAMPLE_DATA: SampleData = {
  stories: [
    { id: 'agi-novel', title: 'AGI Novel' }
  ],
  scenes: [
    { id: 'scene-1', title: 'Scene 1: Arrival', sequence: '1' },
    { id: 'scene-1a', title: 'Scene 1a: Parking Lot', sequence: '1a' },
    { id: 'scene-2', title: 'Scene 2: Entry', sequence: '2' }
  ]
};

function App() {
  const [showStorySelector, setShowStorySelector] = useState(false);
  const [showSceneList, setShowSceneList] = useState(true);
  const [activeStory, setActiveStory] = useState<Story>(SAMPLE_DATA.stories[0]);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [activeSection, setActiveSection] = useState<NavSection | null>(null);
  const [activeFilters, setActiveFilters] = useState<NavSection[]>([]);

  const activeSceneId: string | null = activeScene ? activeScene.id : null;

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

  return (
    <div className="flex h-screen bg-white">
      {/* Story Selector */}
      {showStorySelector && (
        <div className="w-64 border-r bg-gray-50 p-4">
          <h2 className="mb-4 text-lg font-semibold">Stories</h2>
          <div className="space-y-2">
            {SAMPLE_DATA.stories.map(story => (
              <button 
                key={story.id}
                className="w-full rounded-lg bg-white p-3 text-left shadow hover:bg-blue-50"
                onClick={() => {
                  setActiveStory(story);
                  setShowStorySelector(false);
                }}
              >
                {story.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        <Header 
          story={activeStory.title}
          activeScene={activeScene?.title}
          onStorySelect={handleStorySelect}
          onSceneUp={activeScene ? handleSceneUp : undefined}
        />

        {/* Main Navigation - shown when no scene is active */}
        {!activeScene && (
          <MainNav
            activeSection={activeSection}
            onSectionSelect={handleSectionSelect}
          />
        )}

        <div className="flex h-[calc(100vh-4rem)]">
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

          {/* Other Section Content */}
          {!activeScene && activeSection && activeSection !== 'scenes' && (
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