// src/components/layout/Header.tsx
import React from 'react';
import { ChevronLeft, ChevronUp } from 'lucide-react';

interface HeaderProps {
  story: string;
  activeSection?: string;
  activeScene?: string;
  activeChapter?: string;
  onStorySelect: () => void;
  onSectionUp?: () => void;
  onSceneUp?: () => void;
  onChapterUp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  story,
  activeSection,
  activeScene,
  activeChapter,
  onStorySelect,
  onSectionUp,
  onSceneUp,
  onChapterUp,
}) => (
  <div className="flex items-center border-b bg-white p-4 shadow-sm">
    <button 
      className="mr-4 rounded-lg p-1 hover:bg-gray-100"
      onClick={onStorySelect}
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
    
    <h1 className="text-xl font-semibold">{story}</h1>
    
    {activeSection && (
      <>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-semibold">{activeSection}</span>
        {onSectionUp && (
          <button 
            className="ml-2 rounded-lg p-1 hover:bg-gray-100"
            onClick={onSectionUp}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        )}
      </>
    )}

    {activeChapter && (
      <>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-semibold">{activeChapter}</span>
        {onChapterUp && (
          <button 
            className="ml-2 rounded-lg p-1 hover:bg-gray-100"
            onClick={onChapterUp}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        )}
      </>
    )}
  </div>
);