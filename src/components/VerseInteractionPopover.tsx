"use client";

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Sparkles, Pencil, Bookmark, Palette, MessageSquare } from 'lucide-react';
import type { Verse, Annotation } from '@/types';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface VerseInteractionPopoverProps {
  verse: Verse;
  children: React.ReactNode;
  onAnalyze: (verses: Verse[], question?: string) => void;
  onAddAnnotation: (verse: Verse, type: Annotation['type'], noteText?: string, color?: string) => void;
  getAnnotationsForVerse: (verse: Verse) => Annotation[];
  onRemoveAnnotation: (annotationId: string) => void;
}

const highlightColors = [
  { name: 'Yellow', value: 'rgba(255, 243, 128, 0.5)' }, // #fff38080
  { name: 'Blue', value: 'rgba(173, 216, 230, 0.5)' },   // #add8e680
  { name: 'Green', value: 'rgba(144, 238, 144, 0.5)' },  // #90ee9080
  { name: 'Pink', value: 'rgba(255, 192, 203, 0.5)' },   // #ffc0cb80
  { name: 'Purple', value: 'rgba(221, 160, 221, 0.5)' }, // #dda0dd80
];


export function VerseInteractionPopover({
  verse,
  children,
  onAnalyze,
  onAddAnnotation,
  getAnnotationsForVerse,
  onRemoveAnnotation,
}: VerseInteractionPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const { toast } = useToast();

  const verseAnnotations = getAnnotationsForVerse(verse);
  const isBookmarked = verseAnnotations.some(a => a.type === 'bookmark');
  const isHighlighted = verseAnnotations.some(a => a.type === 'highlight');

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddAnnotation(verse, 'note', noteText.trim());
      setNoteText('');
      setShowNoteInput(false);
      setPopoverOpen(false);
    } else {
      toast({ title: "Note is empty", description: "Please write something in your note.", variant: "destructive" });
    }
  };
  
  const handleToggleBookmark = () => {
    if (isBookmarked) {
      const bookmark = verseAnnotations.find(a => a.type === 'bookmark');
      if (bookmark) onRemoveAnnotation(bookmark.id);
    } else {
      onAddAnnotation(verse, 'bookmark');
    }
    setPopoverOpen(false);
  };

  const handleHighlight = (color: string) => {
    // If already highlighted with any color, remove existing highlight first
    const existingHighlight = verseAnnotations.find(a => a.type === 'highlight');
    if (existingHighlight) {
      onRemoveAnnotation(existingHighlight.id);
    }
    onAddAnnotation(verse, 'highlight', undefined, color);
    setPopoverOpen(false);
  };
  
  const handleRemoveHighlight = () => {
    const highlight = verseAnnotations.find(a => a.type === 'highlight');
    if (highlight) onRemoveAnnotation(highlight.id);
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 space-y-2" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { onAnalyze([verse]); setPopoverOpen(false); }}>
          <Sparkles className="w-4 h-4 mr-2" /> Analyze Verse
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleToggleBookmark}>
          <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-accent stroke-accent' : ''}`} /> 
          {isBookmarked ? 'Remove Bookmark' : 'Bookmark Verse'}
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Palette className="w-4 h-4 mr-2" /> Highlight Verse
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="p-1">
            <div className="flex flex-col space-y-1">
              {highlightColors.map(color => (
                <Button
                  key={color.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleHighlight(color.value)}
                >
                  <span className="w-3 h-3 rounded-full mr-2 border border-border" style={{ backgroundColor: color.value }} />
                  {color.name}
                </Button>
              ))}
              {isHighlighted && (
                 <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-destructive" onClick={handleRemoveHighlight}>
                    Remove Highlight
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setShowNoteInput(true); setNoteText(''); /* Keep popover open */}}>
          <MessageSquare className="w-4 h-4 mr-2" /> Add Note
        </Button>

        {showNoteInput && (
          <div className="p-2 border-t mt-2">
            <Textarea
              placeholder={`Note for ${verse.book_name} ${verse.chapter}:${verse.verse}...`}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[60px] text-sm mb-2"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setShowNoteInput(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAddNote}>Save Note</Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
