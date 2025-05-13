"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Library, ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { ALL_BOOKS, KJV_BIBLE_DATA } from '@/lib/bible-data';
import type { Book as BookType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'; // Removed SidebarTrigger as it's not used directly in this file after refactor
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarInnerContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  selectedBookName: string;
  selectedChapterNumber: number;
  expandedBook: string | null;
  onBookSelect: (bookName: string) => void;
  onBookToggle: (bookName: string) => void;
  onChapterSelect: (chapterNumber: number) => void;
  onShowBookmarks: () => void;
  onShowHighlights: () => void;
  onShowNotes: () => void;
  onShowLibrary: () => void;
}

const SidebarInnerContent: React.FC<SidebarInnerContentProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearchSubmit,
  selectedBookName,
  selectedChapterNumber,
  expandedBook,
  onBookSelect,
  onBookToggle,
  onChapterSelect,
  onShowBookmarks,
  onShowHighlights,
  onShowNotes,
  onShowLibrary,
}) => {
  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <h1 className="text-2xl font-semibold text-sidebar-foreground">Divine Insight</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <ScrollArea className="h-full">
          <SidebarGroup className="p-2">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 p-2">
              <Input
                type="search"
                placeholder="Search KJV Bible..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background text-foreground placeholder:text-muted-foreground"
                aria-label="Search KJV Bible"
              />
              <Button type="submit" size="icon" variant="outline" aria-label="Perform search">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </SidebarGroup>

          <SidebarGroup className="p-2">
            <SidebarGroupLabel className="text-sidebar-foreground/70">Bible Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {ALL_BOOKS.map((book) => {
                const currentBookData = KJV_BIBLE_DATA.find(b => b.name === book.name);
                return (
                  <SidebarMenuItem key={book.name}>
                    <SidebarMenuButton
                      onClick={() => onBookSelect(book.name)}
                      onDoubleClick={() => onBookToggle(book.name)}
                      isActive={book.name === selectedBookName}
                      className="justify-between w-full"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {book.name}
                      </span>
                      {currentBookData && currentBookData.chapters.length > 0 && (
                        expandedBook === book.name ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                      )}
                    </SidebarMenuButton>
                    {expandedBook === book.name && currentBookData && (
                      <SidebarMenuSub className="my-1">
                        <div className="grid grid-cols-5 gap-1 p-1">
                          {currentBookData.chapters.map((chap) => (
                            <SidebarMenuSubButton
                              key={`${book.name}-${chap.chapter}`}
                              onClick={() => onChapterSelect(chap.chapter)}
                              isActive={book.name === selectedBookName && chap.chapter === selectedChapterNumber}
                              className="text-center justify-center aspect-square h-auto p-0"
                            >
                              {chap.chapter}
                            </SidebarMenuSubButton>
                          ))}
                        </div>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="p-2">
             <SidebarGroupLabel className="text-sidebar-foreground/70">My Library</SidebarGroupLabel>
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={onShowBookmarks}>Bookmarks</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={onShowHighlights}>Highlights</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={onShowNotes}>Notes</SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground" onClick={onShowLibrary}>
          <Library className="w-5 h-5" />
          Reference Library
        </Button>
      </SidebarFooter>
    </>
  );
};


interface AppSidebarProps {
  selectedBookName: string;
  selectedChapterNumber: number;
  onSelectBook: (bookName: string) => void;
  onSelectChapter: (chapterNumber: number) => void;
  onSearch: (term: string) => void;
  onShowLibrary: () => void;
  onShowBookmarks: () => void;
  onShowHighlights: () => void;
  onShowNotes: () => void;
}

export function AppSidebar({
  selectedBookName,
  selectedChapterNumber,
  onSelectBook,
  onSelectChapter,
  onSearch,
  onShowLibrary,
  onShowBookmarks,
  onShowHighlights,
  onShowNotes,
}: AppSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBook, setExpandedBook] = useState<string | null>(selectedBookName);
  const isMobile = useIsMobile();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  useEffect(() => {
    setExpandedBook(selectedBookName);
  }, [selectedBookName]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      if (isMobile) setMobileSheetOpen(false);
    }
  };

  const handleBookToggleInternal = (bookName: string) => {
    setExpandedBook(prev => (prev === bookName ? null : bookName));
  };

  const handleChapterSelectInternal = (chapterNumber: number) => {
    onSelectChapter(chapterNumber);
    if (isMobile) setMobileSheetOpen(false);
  }

  const handleBookSelectInternal = (bookName: string) => {
    onSelectBook(bookName);
    // If the book is not expanded, expand it. If it is, keep it expanded.
    // This behavior relies on useEffect to set expandedBook when selectedBookName prop changes.
    // If clicking the same book (selectedBookName prop doesn't change), this ensures it expands if collapsed.
    if (expandedBook !== bookName) {
        setExpandedBook(bookName);
    }
  }
  
  const createMobileAwareHandler = (handler: () => void) => () => {
    handler();
    if (isMobile) setMobileSheetOpen(false);
  };

  const sidebarInnerProps: SidebarInnerContentProps = {
    searchTerm,
    setSearchTerm,
    handleSearchSubmit,
    selectedBookName,
    selectedChapterNumber,
    expandedBook,
    onBookSelect: handleBookSelectInternal,
    onBookToggle: handleBookToggleInternal,
    onChapterSelect: handleChapterSelectInternal,
    onShowBookmarks: createMobileAwareHandler(onShowBookmarks),
    onShowHighlights: createMobileAwareHandler(onShowHighlights),
    onShowNotes: createMobileAwareHandler(onShowNotes),
    onShowLibrary: createMobileAwareHandler(onShowLibrary),
  };


  if (isMobile) {
    return (
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetTrigger asChild>
           <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm">
            <Menu className="h-5 w-5" />
             <span className="sr-only">Open Navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[300px] bg-sidebar text-sidebar-foreground flex flex-col">
          <SidebarInnerContent {...sidebarInnerProps} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border flex flex-col">
       <SidebarInnerContent {...sidebarInnerProps} />
    </Sidebar>
  );
}
