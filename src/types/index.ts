export interface Verse {
  book_name: string; // Added to uniquely identify verse for annotations
  chapter: number;   // Added to uniquely identify verse for annotations
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Book {
  name: string;
  abbreviation: string;
  chapters: Chapter[];
}

export interface Annotation {
  id: string; // Unique ID for the annotation
  bookName: string;
  chapter: number;
  verse: number;
  type: 'bookmark' | 'highlight' | 'note';
  noteText?: string;
  createdAt: string; // ISO date string
  color?: string; // For highlights
}

export interface LexiconEntry {
  term: string;
  definition: string;
  greek?: string;
  hebrew?: string;
}

export type ActivePanel = 'ai' | 'annotations' | 'search' | 'library' | null;
