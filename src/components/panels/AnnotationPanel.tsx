"use client";

import React, { useState } from 'react';
import type { Annotation, Verse } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Palette, MessageSquare, Trash2, Edit3 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AnnotationPanelProps {
  annotations: Annotation[];
  onRemoveAnnotation: (annotationId: string) => void;
  onUpdateNote: (annotationId: string, newText: string) => void;
  onNavigateToVerse: (bookName: string, chapter: number, verse: number) => void;
  onClose: () => void;
}

type ActiveTab = "bookmarks" | "highlights" | "notes";

export function AnnotationPanel({ 
    annotations, 
    onRemoveAnnotation,
    onUpdateNote,
    onNavigateToVerse,
    onClose 
}: AnnotationPanelProps) {
  const [editingNote, setEditingNote] = useState<Annotation | null>(null);
  const [editText, setEditText] = useState("");
  const { toast } = useToast();

  const handleEditNote = (annotation: Annotation) => {
    if (annotation.type === 'note') {
      setEditingNote(annotation);
      setEditText(annotation.noteText || "");
    }
  };

  const handleSaveNote = () => {
    if (editingNote && editText.trim()) {
      onUpdateNote(editingNote.id, editText.trim());
      toast({ title: "Note updated", description: "Your note has been saved." });
      setEditingNote(null);
      setEditText("");
    } else if (editingNote) {
      toast({ title: "Note is empty", description: "Please enter some text for your note or cancel.", variant: "destructive" });
    }
  };

  const renderAnnotationItem = (annotation: Annotation) => (
    <div key={annotation.id} className="p-3 border-b flex justify-between items-start hover:bg-muted/50 transition-colors rounded-md group">
      <div>
        <button 
          onClick={() => onNavigateToVerse(annotation.bookName, annotation.chapter, annotation.verse)}
          className="font-medium text-sm text-primary hover:underline cursor-pointer text-left"
        >
          {annotation.bookName} {annotation.chapter}:{annotation.verse}
        </button>
        {annotation.type === 'highlight' && annotation.color && (
          <div className="flex items-center mt-1">
             <span className="w-3 h-3 rounded-full mr-2 border border-border" style={{ backgroundColor: annotation.color }} />
             <span className="text-xs text-muted-foreground">Highlighted</span>
          </div>
        )}
        {annotation.type === 'note' && annotation.noteText && (
          <p className="text-xs text-foreground mt-1 whitespace-pre-wrap">{annotation.noteText}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{new Date(annotation.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {annotation.type === 'note' && (
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleEditNote(annotation)}>
            <Edit3 className="w-3.5 h-3.5" />
            <span className="sr-only">Edit Note</span>
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
              <span className="sr-only">Remove Annotation</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this {annotation.type}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemoveAnnotation(annotation.id)} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  const bookmarks = annotations.filter(a => a.type === 'bookmark').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const highlights = annotations.filter(a => a.type === 'highlight').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const notes = annotations.filter(a => a.type === 'note').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">My Annotations</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        <CardDescription>Manage your bookmarks, highlights, and notes.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <Tabs defaultValue="bookmarks" className="flex-1 flex flex-col">
          <TabsList className="m-2">
            <TabsTrigger value="bookmarks" className="flex-1 gap-1.5"><Bookmark className="w-4 h-4"/>Bookmarks ({bookmarks.length})</TabsTrigger>
            <TabsTrigger value="highlights" className="flex-1 gap-1.5"><Palette className="w-4 h-4"/>Highlights ({highlights.length})</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1 gap-1.5"><MessageSquare className="w-4 h-4"/>Notes ({notes.length})</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-1 px-2 pb-2">
            <TabsContent value="bookmarks">
              {bookmarks.length > 0 ? bookmarks.map(renderAnnotationItem) : <p className="text-muted-foreground text-sm text-center py-4">No bookmarks yet.</p>}
            </TabsContent>
            <TabsContent value="highlights">
              {highlights.length > 0 ? highlights.map(renderAnnotationItem) : <p className="text-muted-foreground text-sm text-center py-4">No highlights yet.</p>}
            </TabsContent>
            <TabsContent value="notes">
              {notes.length > 0 ? notes.map(renderAnnotationItem) : <p className="text-muted-foreground text-sm text-center py-4">No notes yet.</p>}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>

      {editingNote && (
        <AlertDialog open={!!editingNote} onOpenChange={() => { if (!editingNote) return; setEditingNote(null); setEditText(""); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Note for {editingNote.bookName} {editingNote.chapter}:{editingNote.verse}</AlertDialogTitle>
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[100px] mt-2"
                placeholder="Enter your note..."
              />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {setEditingNote(null); setEditText("");}}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveNote}>Save Note</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}
