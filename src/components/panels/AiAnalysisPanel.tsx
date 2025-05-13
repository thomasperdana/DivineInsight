"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Verse } from '@/types';
import { summarizePassage } from '@/ai/flows/passage-summary';
import { explainVerse } from '@/ai/flows/verse-explanation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThumbsUp, ThumbsDown, Bot } from 'lucide-react'; // Using Bot icon for AI
import { useToast } from '@/hooks/use-toast';

interface AiAnalysisPanelProps {
  targetVerses?: Verse[];
  targetPassageText?: string;
  targetPassageRef?: string; // e.g. "Genesis 1"
  onClose: () => void;
}

type AnalysisMode = 'passageSummary' | 'verseExplanation';

export function AiAnalysisPanel({ 
  targetVerses, 
  targetPassageText, 
  targetPassageRef,
  onClose 
}: AiAnalysisPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<AnalysisMode>('verseExplanation');
  const { toast } = useToast();

  useEffect(() => {
    if (targetPassageText && targetPassageRef) {
      setMode('passageSummary');
      setAnalysisResult(null); // Clear previous results
      setError(null);
      performPassageSummary();
    } else if (targetVerses && targetVerses.length > 0) {
      setMode('verseExplanation');
      setAnalysisResult(null); // Clear previous results
      setError(null);
      // Optionally auto-run if no question needed, or wait for question
      if (targetVerses.length === 1) { // Auto-run for single verse
        performVerseExplanation();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetVerses, targetPassageText, targetPassageRef]);

  const performPassageSummary = useCallback(async () => {
    if (!targetPassageText) return;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
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
  }, [targetPassageText, toast]);

  const performVerseExplanation = useCallback(async () => {
    if (!targetVerses || targetVerses.length === 0) return;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      // For multiple verses, concatenate them. For single, use as is.
      const verseText = targetVerses.map(v => `${v.book_name} ${v.chapter}:${v.verse} - ${v.text}`).join('\n');
      const result = await explainVerse({ verse: verseText, question: question || undefined });
      setAnalysisResult(result.explanation);
    } catch (e) {
      console.error("Error explaining verse(s):", e);
      setError("Failed to explain verse(s). Please try again.");
      toast({ title: "AI Error", description: "Could not explain verse(s).", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [targetVerses, question, toast]);

  const handleSubmitQuestion = () => {
    if (mode === 'verseExplanation') {
      performVerseExplanation();
    }
    // For passage summary, question is not directly used in current AI flow,
    // but could be adapted or a new flow created if needed.
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
    return 'AI Theological Analysis';
  };

  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl"><Bot className="w-6 h-6 text-primary" /> {getTitle()}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        {mode === 'verseExplanation' && targetVerses && targetVerses.length > 0 && (
           <CardDescription>
            Ask a specific question about {targetVerses.length > 1 ? "these verses" : "this verse"}, or get a general explanation.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
        {mode === 'verseExplanation' && targetVerses && targetVerses.length > 0 && (
          <div className="space-y-2">
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

        {isLoading && (
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && !isLoading && (
          <ScrollArea className="flex-1 pr-2">
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
              {analysisResult}
            </div>
          </ScrollArea>
        )}
        
        {!isLoading && !analysisResult && !error && mode === 'verseExplanation' && (!targetVerses || targetVerses.length === 0) && (
            <p className="text-muted-foreground text-center py-4">Select a verse or passage to analyze.</p>
        )}


      </CardContent>
      {analysisResult && !isLoading && (
        <div className="p-4 border-t flex justify-end items-center space-x-2">
            <span className="text-xs text-muted-foreground">Was this analysis helpful?</span>
            <Button variant="outline" size="icon" aria-label="Helpful">
                <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Not helpful">
                <ThumbsDown className="w-4 h-4" />
            </Button>
        </div>
      )}
    </Card>
  );
}
