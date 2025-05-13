"use client";

import React, { useState } from 'react';
import { LEXICON_DATA } from '@/lib/bible-data';
import type { LexiconEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Library } from 'lucide-react';

interface LibraryPanelProps {
  onClose: () => void;
}

export function LibraryPanel({ onClose }: LibraryPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLexicon = LEXICON_DATA.filter(entry =>
    entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.greek && entry.greek.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.hebrew && entry.hebrew.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl"><Library className="w-6 h-6 text-primary"/>Reference Library</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        <CardDescription>Browse lexicon and other reference materials.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
        <Input
          type="search"
          placeholder="Search lexicon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background text-foreground placeholder:text-muted-foreground"
          aria-label="Search lexicon"
        />
        <ScrollArea className="flex-1 pr-2">
          {filteredLexicon.length > 0 ? (
            <div className="space-y-3">
              {filteredLexicon.map((entry) => (
                <div key={entry.term} className="p-3 border rounded-md">
                  <h3 className="font-semibold text-md text-primary">{entry.term}</h3>
                  {entry.greek && <p className="text-sm text-muted-foreground italic">Greek: {entry.greek}</p>}
                  {entry.hebrew && <p className="text-sm text-muted-foreground italic">Hebrew: {entry.hebrew}</p>}
                  <p className="text-sm text-foreground mt-1 leading-relaxed">{entry.definition}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-4">No lexicon entries found for "{searchTerm}".</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
