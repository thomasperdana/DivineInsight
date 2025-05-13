"use client";

import React from 'react';
import type { Verse, Annotation } from '@/types';
import { cn } from '@/lib/utils';
import { VerseInteractionPopover } from './VerseInteractionPopover';

interface VerseItemProps {
  verse: Verse;
  isSelected: boolean;
  annotations: Annotation[];
  onVerseSelect: (verse: Verse, isCtrlPressed: boolean) => void;
  onAnalyze: (verses: Verse[], question?: string) => void;
  onFindCrossReferences: (verse: Verse) => void;
  onAddAnnotation: (verse: Verse, type: Annotation['type'], noteText?: string, color?: string) => void;
  onRemoveAnnotation: (annotationId: string) => void;
  getAnnotationsForVerse: (verse: Verse) => Annotation[];
}

export function VerseItem({
  verse,
  isSelected,
  annotations,
  onVerseSelect,
  onAnalyze,
  onFindCrossReferences,
  onAddAnnotation,
  onRemoveAnnotation,
  getAnnotationsForVerse
}: VerseItemProps) {
  
  const isBookmarked = annotations.some(a => a.type === 'bookmark');
  const noteCount = annotations.filter(a => a.type === 'note').length;
  const highlightAnnotation = annotations.find(a => a.type === 'highlight');
  
  const verseStyle: React.CSSProperties = {};
  if (highlightAnnotation && highlightAnnotation.color) {
    verseStyle.backgroundColor = highlightAnnotation.color;
  }

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    onVerseSelect(verse, event.ctrlKey || event.metaKey);
  };

  return (
    <VerseInteractionPopover 
      verse={verse} 
      onAnalyze={onAnalyze} 
      onFindCrossReferences={onFindCrossReferences}
      onAddAnnotation={onAddAnnotation}
      getAnnotationsForVerse={getAnnotationsForVerse}
      onRemoveAnnotation={onRemoveAnnotation}
    >
      <div
        onClick={handleClick}
        className={cn(
          "p-2 rounded-md transition-colors cursor-pointer hover:bg-primary/10",
          isSelected && "bg-primary/20 ring-2 ring-primary",
          "relative"
        )}
        style={verseStyle}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        aria-label={`Verse ${verse.chapter}:${verse.verse}`}
      >
        <sup className="font-medium text-xs text-muted-foreground select-none mr-1">{verse.verse}</sup>
        <span className="leading-relaxed">{verse.text}</span>
        <div className="absolute top-0 right-0 flex items-center p-1 opacity-70">
          {isBookmarked && <span title="Bookmarked" className="text-xs text-accent mr-1">🔖</span>}
          {noteCount > 0 && <span title={`${noteCount} note(s)`} className="text-xs text-secondary mr-1">📝{noteCount > 1 ? noteCount : ''}</span>}
        </div>
      </div>
    </VerseInteractionPopover>
  );
}