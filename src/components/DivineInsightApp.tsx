"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { BibleDisplay } from '@/components/BibleDisplay';
import { RightPanelManager } from '@/components/RightPanelManager';
import { KJV_BIBLE_DATA } from '@/lib/bible-data';
import type { ActivePanel, Verse, Annotation } from '@/types';
import { useAnnotations } from '@/hooks/useAnnotations';
import { useToast } from "@/hooks/use-toast";
import { Button } from './ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

export function DivineInsightApp() {
  const [selectedBookName, setSelectedBookName] = useState<string>(KJV_BIBLE_DATA[0].name);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(KJV_BIBLE_DATA[0].chapters[0].chapter);
  const [selectedVerses, setSelectedVerses] = useState<Verse[]>([]);
  
  const [activeRightPanelKey, setActiveRightPanelKey] = useState<ActivePanel>(null);
  const [rightPanelData, setRightPanelData] = useState<any>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);


  const { annotations, addAnnotation, removeAnnotation, updateNoteText, getAnnotationsForVerse, getAnnotationsByType } = useAnnotations();
  const { toast } = useToast();

  const handleSelectBook = useCallback((bookName: string) => {
    const book = KJV_BIBLE_DATA.find(b => b.name === bookName);
    if (book) {
      setSelectedBookName(bookName);
      setSelectedChapterNumber(book.chapters[0].chapter);
      setSelectedVerses([]);
      setActiveRightPanelKey(null); // Close panel on navigation
      setIsRightPanelOpen(false);
    }
  }, []);

  const handleSelectChapter = useCallback((chapterNumber: number) => {
    setSelectedChapterNumber(chapterNumber);
    setSelectedVerses([]);
    setActiveRightPanelKey(null); // Close panel on navigation
    setIsRightPanelOpen(false);
  }, []);

  const handleVerseSelect = useCallback((verse: Verse, isCtrlPressed: boolean) => {
    setSelectedVerses(prevSelected => {
      const existingIndex = prevSelected.findIndex(v => 
        v.book_name === verse.book_name && v.chapter === verse.chapter && v.verse === verse.verse
      );
      if (isCtrlPressed) {
        if (existingIndex > -1) {
          return prevSelected.filter((_, index) => index !== existingIndex); // Toggle off
        } else {
          return [...prevSelected, verse]; // Add to selection
        }
      } else {
        if (existingIndex > -1 && prevSelected.length === 1) {
          return []; // Deselect if it's the only one selected
        }
        return [verse]; // Select only this verse
      }
    });
  }, []);

  const openRightPanel = (key: ActivePanel, data: any = null) => {
    setActiveRightPanelKey(key);
    setRightPanelData(data);
    setIsRightPanelOpen(true);
  };

  const closeRightPanel = useCallback(() => {
    setActiveRightPanelKey(null);
    setRightPanelData(null);
    setIsRightPanelOpen(false);
  }, []);

  const handleSearch = useCallback((term: string) => {
    openRightPanel('search', { searchTerm: term });
  }, []);

  const handleShowLibrary = useCallback(() => {
    openRightPanel('library');
  }, []);

  const handleShowAnnotations = useCallback((type: 'bookmarks' | 'highlights' | 'notes') => {
    // The AnnotationPanel itself has tabs, so we just open it.
    // The specific type can be used to default the tab if needed in future.
    openRightPanel('annotations');
  }, []);

  const handleAnalyzePassage = useCallback((passageText: string, passageRef: string) => {
    openRightPanel('ai', { passageText, passageRef });
  }, []);

  const handleAnalyzeVerses = useCallback((verses: Verse[], question?: string) => {
    if (verses.length === 0) {
      toast({ title: "No Verses Selected", description: "Please select one or more verses to analyze.", variant: "default" });
      return;
    }
    openRightPanel('ai', { verses, question });
  }, [toast]);

  const handleNavigateToVerse = useCallback((bookName: string, chapter: number, verseNum: number) => {
    setSelectedBookName(bookName);
    setSelectedChapterNumber(chapter);
    const verseToSelect = KJV_BIBLE_DATA.find(b => b.name === bookName)
      ?.chapters.find(c => c.chapter === chapter)
      ?.verses.find(v => v.verse === verseNum);
    if (verseToSelect) {
      setSelectedVerses([verseToSelect]);
    }
    closeRightPanel(); // Close panel after navigation
    // Optionally, scroll to verse if BibleDisplay supports it
  }, [closeRightPanel]);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        closeRightPanel();
       }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [closeRightPanel]);


  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground">
        <AppSidebar
          selectedBookName={selectedBookName}
          selectedChapterNumber={selectedChapterNumber}
          onSelectBook={handleSelectBook}
          onSelectChapter={handleSelectChapter}
          onSearch={handleSearch}
          onShowLibrary={handleShowLibrary}
          onShowBookmarks={() => handleShowAnnotations('bookmarks')}
          onShowHighlights={() => handleShowAnnotations('highlights')}
          onShowNotes={() => handleShowAnnotations('notes')}
        />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden relative">
          <header className="p-2 border-b md:hidden flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-10">
             {/* Mobile sidebar trigger is in AppSidebar itself */}
             {/* Placeholder for mobile header content if needed */}
             <div/> {/* To keep space for mobile sidebar trigger */}
             {activeRightPanelKey === null && (
              <Button variant="ghost" size="icon" onClick={() => openRightPanel('annotations', null)}>
                <PanelRightOpen className="w-5 h-5" />
                <span className="sr-only">Open Annotations</span>
              </Button>
            )}
          </header>
          <BibleDisplay
            selectedBookName={selectedBookName}
            selectedChapterNumber={selectedChapterNumber}
            selectedVerses={selectedVerses}
            annotations={annotations}
            onVerseSelect={handleVerseSelect}
            onAnalyzePassage={handleAnalyzePassage}
            onAnalyzeVerses={handleAnalyzeVerses}
            onAddAnnotation={addAnnotation}
            onRemoveAnnotation={removeAnnotation}
            getAnnotationsForVerse={getAnnotationsForVerse}
          />
        </SidebarInset>
        
        <RightPanelManager
            activePanelKey={isRightPanelOpen ? activeRightPanelKey : null}
            panelData={rightPanelData}
            onClosePanel={closeRightPanel}
            annotations={annotations}
            onRemoveAnnotation={removeAnnotation}
            onUpdateNote={updateNoteText}
            onNavigateToVerse={handleNavigateToVerse}
          />

      </div>
    </SidebarProvider>
  );
}
