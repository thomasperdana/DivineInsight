"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { KeywordSearchOutput } from '@/ai/flows/keyword-search';
import { keywordSearch } from '@/ai/flows/keyword-search';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from 'lucide-react'; // Icon for search results/insights
import { useToast } from '@/hooks/use-toast';

interface SearchPanelProps {
  searchTerm: string;
  onNavigateToVerse: (bookName: string, chapter: number, verse: number) => void;
  onClose: () => void;
}

export function SearchPanel({ searchTerm, onNavigateToVerse, onClose }: SearchPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<KeywordSearchOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const performSearch = useCallback(async (term: string) => {
    if (!term) return;
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    try {
      const result = await keywordSearch({ keyword: term });
      setSearchResult(result);
    } catch (e) {
      console.error("Error performing keyword search:", e);
      setError("Failed to perform search. Please try again.");
      toast({ title: "Search Error", description: "Could not perform search.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    }
  }, [searchTerm, performSearch]);

  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader className="border-b">
         <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl"><Lightbulb className="w-6 h-6 text-primary" /> Search Results</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        <CardDescription>Results for: "{searchTerm}"</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
        {isLoading && (
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {searchResult && !isLoading && (
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">Theological Summary</h3>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{searchResult.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">Relevant Verses ({searchResult.verses.length})</h3>
                <div className="space-y-3">
                  {searchResult.verses.map((verse, index) => (
                    <div key={index} className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <button 
                        onClick={() => onNavigateToVerse(verse.book, verse.chapter, verse.verseNumber)}
                        className="font-medium text-sm text-primary hover:underline cursor-pointer text-left block mb-1"
                      >
                        {verse.book} {verse.chapter}:{verse.verseNumber}
                      </button>
                      <p className="text-xs text-foreground">{verse.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">Relevance: {(verse.relevanceScore * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                   {searchResult.verses.length === 0 && (
                    <p className="text-sm text-muted-foreground">No specific verses found directly matching your query, but the summary above may provide context.</p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
         {!isLoading && !searchResult && !error && (
            <p className="text-muted-foreground text-center py-4">Enter a term in the sidebar to search.</p>
        )}
      </CardContent>
    </Card>
  );
}
