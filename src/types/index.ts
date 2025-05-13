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

// ActivePanel and its associated data can be refined if specific typed data is preferred for each panel.
// For AiAnalysisPanel, panelData might look like:
// { mode: 'passageSummary', passageText: string, passageRef: string }
// | { mode: 'verseExplanation', verses: Verse[], question?: string }
// | { mode: 'crossReference', verseForCrossReference: Verse }
// For SearchPanel: { searchTerm: string }
// For Annotations: { defaultTab?: 'bookmarks' | 'highlights' | 'notes' }
// For Library: {} (no specific data needed to open)
export type ActivePanel = 'ai' | 'annotations' | 'search' | 'library' | null;