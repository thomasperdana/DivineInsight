"use client";

import React from 'react';
import type { ActivePanel, Verse, Annotation } from '@/types';
import { AiAnalysisPanel } from './panels/AiAnalysisPanel';
import { AnnotationPanel } from './panels/AnnotationPanel';
import { SearchPanel } from './panels/SearchPanel';
import { LibraryPanel } from './panels/LibraryPanel';

interface RightPanelManagerProps {
  activePanelKey: ActivePanel;
  panelData: any; // Could be more specific with discriminated unions if needed
  onClosePanel: () => void;
  // Props for AnnotationPanel
  annotations: Annotation[];
  onRemoveAnnotation: (annotationId: string) => void;
  onUpdateNote: (annotationId: string, newText: string) => void;
  onNavigateToVerse: (bookName: string, chapter: number, verseNumber: number) => void;
  // Prop for SearchPanel and potentially others that might initiate cross-referencing
  onFindCrossReferences: (verse: Verse) => void; 
}

export function RightPanelManager({
  activePanelKey,
  panelData,
  onClosePanel,
  annotations,
  onRemoveAnnotation,
  onUpdateNote,
  onNavigateToVerse,
  onFindCrossReferences, // Destructure the new prop
}: RightPanelManagerProps) {
  if (!activePanelKey) {
    return null;
  }

  const panelBaseClasses = "fixed top-0 right-0 h-full w-full md:w-[400px] lg:w-[500px] z-40 bg-card shadow-2xl transition-transform duration-300 ease-in-out transform";
  const panelVisibleClasses = "translate-x-0";
  const panelHiddenClasses = "translate-x-full";
  
  const panelWrapperClasses = `fixed inset-0 bg-black/30 z-30 md:hidden ${activePanelKey ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-opacity duration-300`;


  return (
    <>
      {/* Overlay for mobile */}
      <div className={panelWrapperClasses} onClick={onClosePanel} />

      <div className={`${panelBaseClasses} ${activePanelKey ? panelVisibleClasses : panelHiddenClasses}`}>
        {activePanelKey === 'ai' && (
          <AiAnalysisPanel
            panelData={panelData}
            onClose={onClosePanel}
            onNavigateToVerse={onNavigateToVerse}
          />
        )}
        {activePanelKey === 'annotations' && (
          <AnnotationPanel
            annotations={annotations}
            onRemoveAnnotation={onRemoveAnnotation}
            onUpdateNote={onUpdateNote}
            onNavigateToVerse={onNavigateToVerse}
            onClose={onClosePanel}
          />
        )}
        {activePanelKey === 'search' && (
          <SearchPanel
            searchTerm={panelData?.searchTerm || ''}
            onNavigateToVerse={onNavigateToVerse}
            onClose={onClosePanel}
            onFindCrossReferences={onFindCrossReferences} // Pass the prop to SearchPanel
          />
        )}
        {activePanelKey === 'library' && (
          <LibraryPanel onClose={onClosePanel} />
        )}
      </div>
    </>
  );
}