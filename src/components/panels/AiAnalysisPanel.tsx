"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Verse } from '@/types';
import { summarizePassage } from '@/ai/flows/passage-summary';
import { explainVerse } from '@/ai/flows/verse-explanation';
import { findCrossReferences, type CrossReferenceOutput } from '@/ai/flows/cross-reference-flow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThumbsUp, ThumbsDown, Bot, Link2, BookOpenText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AiAnalysisPanelProps {
  panelData?: {
    mode: AnalysisMode;
    verses?: Verse[]; // For verseExplanation
    verseForCrossReference?: Verse; // For crossReference
    passageText?: string; // For passageSummary
    passageRef?: string; // For passageSummary
    question?: string; // Optional initial question for verseExplanation
  };
  onClose: () => void;
  onNavigateToVerse?: (bookName: string, chapter: number, verseNumber: number) => void;
}

type AnalysisMode = 'passageSummary' | 'verseExplanation' | 'crossReference';

export function AiAnalysisPanel({ 
  panelData,
  onClose,
  onNavigateToVerse,
}: AiAnalysisPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [crossReferenceResult, setCrossReferenceResult] = useState<CrossReferenceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState(panelData?.question || '');
  const { toast } = useToast();

  const mode = panelData?.mode;
  const targetVerses = panelData?.verses;
  const targetPassageText = panelData?.passageText;
  const targetPassageRef = panelData?.passageRef;
  const targetVerseForCrossReference = panelData?.verseForCrossReference;


  const clearState = useCallback(() => {
    setAnalysisResult(null);
    setCrossReferenceResult(null);
    setError(null);
    // setQuestion(''); // Don't clear question if it was pre-filled
  }, []);

  const performPassageSummary = useCallback(async () => {
    if (!targetPassageText) return;
    clearState();
    setIsLoading(true);
    try {
      const result = await summarizePassage({ passageText: targetPassageText });
      setAnalysisResult(result.summary);
    } catch (e) {
      console.error("Error summarizing passage:", e);
      setError("Failed to summarize passage. Please try again.");
      toast({ title: "AI Error", description: "Could not summarize passage.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [targetPassageText, toast, clearState]);

  const performVerseExplanation = useCallback(async (currentQuestion?: string) => {
    if (!targetVerses || targetVerses.length === 0) return;
    clearState();
    setIsLoading(true);
    try {
      const verseText = targetVerses.map(v => `${v.book_name} ${v.chapter}:${v.verse} - ${v.text}`).join('\n');
      const result = await explainVerse({ verse: verseText, question: currentQuestion || question || undefined });
      setAnalysisResult(result.explanation);
    } catch (e) {
      console.error("Error explaining verse(s):", e);
      setError("Failed to explain verse(s). Please try again.");
      toast({ title: "AI Error", description: "Could not explain verse(s).", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [targetVerses, question, toast, clearState]);

  const performCrossReferenceSearch = useCallback(async () => {
    if (!targetVerseForCrossReference) return;
    clearState();
    setIsLoading(true);
    try {
      const result = await findCrossReferences({
        bookName: targetVerseForCrossReference.book_name,
        chapter: targetVerseForCrossReference.chapter,
        verseNumber: targetVerseForCrossReference.verse,
        verseText: targetVerseForCrossReference.text,
      });
      setCrossReferenceResult(result);
    } catch (e) {
      console.error("Error finding cross-references:", e);
      setError("Failed to find cross-references. Please try again.");
      toast({ title: "AI Error", description: "Could not find cross-references.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [targetVerseForCrossReference, toast, clearState]);
  
  useEffect(() => {
    setQuestion(panelData?.question || ''); // Update question if panelData changes
    if (mode === 'passageSummary' && targetPassageText) {
      performPassageSummary();
    } else if (mode === 'verseExplanation' && targetVerses && targetVerses.length > 0) {
      // Auto-run if no question needed or if question is pre-filled.
      // Or, if only one verse, auto-run, otherwise wait for button.
      if (targetVerses.length === 1 && !question) {
        performVerseExplanation();
      } else if (question) { // If there's an initial question
        performVerseExplanation(question);
      } else {
        // For multiple verses without an initial question, clear previous results and wait for interaction
        clearState();
      }
    } else if (mode === 'crossReference' && targetVerseForCrossReference) {
      performCrossReferenceSearch();
    } else {
        clearState(); // Clear if no valid mode/data
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelData]); // Depends on the entire panelData object

  const handleSubmitQuestion = () => {
    if (mode === 'verseExplanation') {
      performVerseExplanation();
    }
  };

  const getTitle = () => {
    if (mode === 'passageSummary' && targetPassageRef) {
      return `AI Summary for ${targetPassageRef}`;
    }
    if (mode === 'verseExplanation' && targetVerses && targetVerses.length > 0) {
      if (targetVerses.length === 1) {
        const v = targetVerses[0];
        return `AI Explanation for ${v.book_name} ${v.chapter}:${v.verse}`;
      }
      return `AI Explanation for Selected Verses (${targetVerses.length})`;
    }
    if (mode === 'crossReference' && targetVerseForCrossReference) {
      const v = targetVerseForCrossReference;
      return `Cross-References for ${v.book_name} ${v.chapter}:${v.verse}`;
    }
    return 'AI Theological Analysis';
  };
  
  const renderLoading = () => (
    <div className="space-y-2 flex-1 p-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      {mode === 'crossReference' && (
        <>
          <Skeleton className="h-10 w-full mt-4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </>
      )}
    </div>
  );

  const renderError = () => (
    <div className="p-4">
        <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        </Alert>
    </div>
  );

  const renderContent = () => {
    if (analysisResult && (mode === 'passageSummary' || mode === 'verseExplanation')) {
      return (
        <ScrollArea className="flex-1 pr-2 p-4">
          <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
            {analysisResult}
          </div>
        </ScrollArea>
      );
    }
    if (crossReferenceResult && mode === 'crossReference') {
      return (
        <ScrollArea className="flex-1 p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-md mb-1 text-primary">Original Verse Context</h3>
            <p className="text-xs text-muted-foreground italic mb-3">{crossReferenceResult.originalVerseContext}</p>
          </div>
          <div className="space-y-3">
             <h3 className="font-semibold text-md text-primary">References:</h3>
            {crossReferenceResult.crossReferences.map((ref, index) => (
              <div key={index} className="p-3 border rounded-md shadow-sm bg-background/50">
                <button
                  onClick={() => onNavigateToVerse && onNavigateToVerse(ref.book, ref.chapter, ref.verseNumber)}
                  className="font-medium text-sm text-primary hover:underline cursor-pointer text-left block mb-1"
                  disabled={!onNavigateToVerse}
                  title={onNavigateToVerse ? `Go to ${ref.book} ${ref.chapter}:${ref.verseNumber}`: "Navigation unavailable"}
                >
                  {ref.book} {ref.chapter}:{ref.verseNumber}
                </button>
                <p className="text-xs text-foreground mb-1">{ref.text}</p>
                <p className="text-xs text-muted-foreground italic"><strong className="text-secondary">Connection:</strong> {ref.connection}</p>
              </div>
            ))}
            {crossReferenceResult.crossReferences.length === 0 && (
              <p className="text-sm text-muted-foreground">No specific cross-references found by the AI for this verse.</p>
            )}
          </div>
        </ScrollArea>
      );
    }
     if (!targetVerses && !targetPassageText && !targetVerseForCrossReference) {
        return <p className="text-muted-foreground text-center py-4 p-4">Select a verse, passage, or use an action to analyze.</p>;
    }
    if (mode === 'verseExplanation' && targetVerses && targetVerses.length > 1 && !question && !analysisResult){
        return <p className="text-muted-foreground text-center py-4 p-4">Ask a question above or click "Get Explanation" for a general analysis of the selected {targetVerses.length} verses.</p>;
    }


    return null; // Default empty state if no other conditions met
  };
  
  const showFeedback = (analysisResult || crossReferenceResult) && !isLoading;

  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl">
            {mode === 'passageSummary' && <BookOpenText className="w-6 h-6 text-primary" />}
            {mode === 'verseExplanation' && <Bot className="w-6 h-6 text-primary" />}
            {mode === 'crossReference' && <Link2 className="w-6 h-6 text-primary" />}
            {!mode && <Bot className="w-6 h-6 text-primary" />}
            {getTitle()}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        {mode === 'verseExplanation' && targetVerses && targetVerses.length > 0 && (
           <CardDescription>
            Ask a specific question about {targetVerses.length > 1 ? "these verses" : "this verse"}, or get a general explanation.
          </CardDescription>
        )}
         {mode === 'crossReference' && targetVerseForCrossReference && (
           <CardDescription>
            Showing verses related by theme to {targetVerseForCrossReference.book_name} {targetVerseForCrossReference.chapter}:{targetVerseForCrossReference.verse}.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 space-y-0 overflow-hidden"> {/* Adjusted padding */}
        {mode === 'verseExplanation' && targetVerses && targetVerses.length > 0 && (
          <div className="space-y-2 p-4 border-b">
            <Textarea
              placeholder="Ask a specific question... (optional)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[60px] text-sm"
              aria-label="Ask a question about the selected verses"
            />
            <Button onClick={handleSubmitQuestion} disabled={isLoading} size="sm">
              {isLoading ? 'Analyzing...' : 'Get Explanation'}
            </Button>
          </div>
        )}

        {isLoading && renderLoading()}
        {error && !isLoading && renderError()}
        {!isLoading && !error && renderContent()}
        
      </CardContent>
      {showFeedback && (
        <CardFooter className="p-4 border-t flex justify-end items-center space-x-2">
            <span className="text-xs text-muted-foreground">Was this analysis helpful?</span>
            <Button variant="outline" size="icon" aria-label="Helpful">
                <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Not helpful">
                <ThumbsDown className="w-4 h-4" />
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}