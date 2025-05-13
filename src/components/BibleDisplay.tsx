"use client";

import React from 'react';
import type { Book, Chapter, Verse, Annotation } from '@/types';
import { KJV_BIBLE_DATA } from '@/lib/bible-data';
import { VerseItem } from './VerseItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface BibleDisplayProps {
  selectedBookName: string;
  selectedChapterNumber: number;
  selectedVerses: Verse[];
  annotations: Annotation[];
  onVerseSelect: (verse: Verse, isCtrlPressed: boolean) => void;
  onAnalyzePassage: (passageText: string, passageRef: string) => void;
  onAnalyzeVerses: (verses: Verse[], question?: string) => void;
  onFindCrossReferences: (verse: Verse) => void;
  onAddAnnotation: (verse: Verse, type: Annotation['type'], noteText?: string, color?: string) => void;
  onRemoveAnnotation: (annotationId: string) => void;
  getAnnotationsForVerse: (verse: Verse) => Annotation[];
}

export function BibleDisplay({
  selectedBookName,
  selectedChapterNumber,
  selectedVerses,
  annotations,
  onVerseSelect,
  onAnalyzePassage,
  onAnalyzeVerses,
  onFindCrossReferences,
  onAddAnnotation,
  onRemoveAnnotation,
  getAnnotationsForVerse
}: BibleDisplayProps) {
  const book: Book | undefined = KJV_BIBLE_DATA.find(b => b.name === selectedBookName);
  const chapter: Chapter | undefined = book?.chapters.find(c => c.chapter === selectedChapterNumber);

  if (!book || !chapter) {
    return (
      <Card className="flex-1 m-4">
        <CardHeader>
          <CardTitle>Select a Book and Chapter</CardTitle>
          <CardDescription>Use the sidebar to navigate the Bible.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No content to display.</p>
        </CardContent>
      </Card>
    );
  }

  const handleAnalyzeChapter = () => {
    const passageText = chapter.verses.map(v => v.text).join(' ');
    const passageRef = `${book.name} ${chapter.chapter}`;
    onAnalyzePassage(passageText, passageRef);
  };
  
  const handleAnalyzeSelection = () => {
    if (selectedVerses.length > 0) {
      onAnalyzeVerses(selectedVerses);
    }
  };


  return (
    <ScrollArea className="h-full flex-1 relative">
      <div className="p-4 md:p-6">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-serif">{book.name} {chapter.chapter}</CardTitle>
                <CardDescription>King James Version</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAnalyzeChapter} variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-2" /> Analyze Chapter
                </Button>
                {selectedVerses.length > 0 && (
                  <Button onClick={handleAnalyzeSelection} size="sm">
                    <Sparkles className="w-4 h-4 mr-2" /> Analyze Selection ({selectedVerses.length})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-1">
            {chapter.verses.map((verse) => (
              <VerseItem
                key={`${verse.book_name}-${verse.chapter}-${verse.verse}`}
                verse={verse}
                isSelected={selectedVerses.some(sv => sv.book_name === verse.book_name && sv.chapter === verse.chapter && sv.verse === verse.verse)}
                annotations={getAnnotationsForVerse(verse)}
                onVerseSelect={onVerseSelect}
                onAnalyze={onAnalyzeVerses}
                onFindCrossReferences={onFindCrossReferences}
                onAddAnnotation={onAddAnnotation}
                onRemoveAnnotation={onRemoveAnnotation}
                getAnnotationsForVerse={getAnnotationsForVerse}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}