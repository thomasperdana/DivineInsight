"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Annotation, Verse } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ANNOTATIONS_STORAGE_KEY = 'divineInsightAnnotations';

export function useAnnotations() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedAnnotations = localStorage.getItem(ANNOTATIONS_STORAGE_KEY);
      if (storedAnnotations) {
        setAnnotations(JSON.parse(storedAnnotations));
      }
    } catch (error) {
      console.error("Failed to load annotations from localStorage:", error);
      toast({
        title: "Error",
        description: "Could not load your annotations. They might be corrupted.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveAnnotations = useCallback((updatedAnnotations: Annotation[]) => {
    try {
      localStorage.setItem(ANNOTATIONS_STORAGE_KEY, JSON.stringify(updatedAnnotations));
      setAnnotations(updatedAnnotations);
    } catch (error) {
      console.error("Failed to save annotations to localStorage:", error);
      toast({
        title: "Error",
        description: "Could not save your annotations. Your changes might not persist.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const addAnnotation = useCallback((verse: Verse, type: Annotation['type'], noteText?: string, color?: string) => {
    const newAnnotation: Annotation = {
      id: `${verse.book_name}-${verse.chapter}-${verse.verse}-${type}-${Date.now()}`,
      bookName: verse.book_name,
      chapter: verse.chapter,
      verse: verse.verse,
      type,
      noteText: type === 'note' ? noteText : undefined,
      color: type === 'highlight' ? color : undefined,
      createdAt: new Date().toISOString(),
    };
    
    // Prevent duplicate bookmarks or highlights for the same verse
    if (type === 'bookmark' || type === 'highlight') {
      const existing = annotations.find(a => 
        a.bookName === verse.book_name &&
        a.chapter === verse.chapter &&
        a.verse === verse.verse &&
        a.type === type
      );
      if (existing) {
        toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} already exists`, description: `Verse ${verse.book_name} ${verse.chapter}:${verse.verse} is already ${type}ed.`});
        return;
      }
    }
    
    const updatedAnnotations = [...annotations, newAnnotation];
    saveAnnotations(updatedAnnotations);
    toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} added`, description: `Verse ${verse.book_name} ${verse.chapter}:${verse.verse} has been ${type}ed.`});
  }, [annotations, saveAnnotations, toast]);

  const removeAnnotation = useCallback((annotationId: string) => {
    const updatedAnnotations = annotations.filter(ann => ann.id !== annotationId);
    saveAnnotations(updatedAnnotations);
    toast({ title: "Annotation removed", description: "The annotation has been removed."});
  }, [annotations, saveAnnotations, toast]);

  const updateNoteText = useCallback((annotationId: string, newText: string) => {
    const updatedAnnotations = annotations.map(ann =>
      ann.id === annotationId && ann.type === 'note' ? { ...ann, noteText: newText } : ann
    );
    saveAnnotations(updatedAnnotations);
    toast({ title: "Note updated", description: "Your note has been successfully updated."});
  }, [annotations, saveAnnotations, toast]);

  const getAnnotationsForVerse = useCallback((verse: Verse): Annotation[] => {
    return annotations.filter(
      ann =>
        ann.bookName === verse.book_name &&
        ann.chapter === verse.chapter &&
        ann.verse === verse.verse
    );
  }, [annotations]);
  
  const getAnnotationsByType = useCallback((type: Annotation['type']): Annotation[] => {
    return annotations.filter(ann => ann.type === type).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [annotations]);


  return {
    annotations,
    addAnnotation,
    removeAnnotation,
    updateNoteText,
    getAnnotationsForVerse,
    getAnnotationsByType,
  };
}
