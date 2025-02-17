import React from 'react';
import { Plus } from 'lucide-react';
import type { Chapter } from '../../types';

interface ChapterListProps {
  chapters: Chapter[];
  activeChapter: string | null;
  onChapterSelect: (chapter: Chapter) => void;
  onAddChapter: () => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  activeChapter,
  onChapterSelect,
  onAddChapter,
}) => (
  <div className="w-64 border-r bg-gray-50">
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="font-semibold">Chapters</h2>
      <button
        onClick={onAddChapter}
        className="p-1 rounded-lg hover:bg-gray-100"
        title="Add Chapter"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
    <div className="p-4 space-y-2">
      {chapters.map(chapter => (
        <button
          key={chapter.id}
          className={`w-full rounded-lg p-3 text-left shadow hover:bg-blue-50
            ${activeChapter === chapter.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
          onClick={() => onChapterSelect(chapter)}
        >
          {chapter.title}
        </button>
      ))}
    </div>
  </div>
); 