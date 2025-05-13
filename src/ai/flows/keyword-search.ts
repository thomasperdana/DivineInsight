'use server';

/**
 * @fileOverview A keyword search AI agent for theological concepts in the KJV Bible.
 *
 * - keywordSearch - A function that handles the keyword search process.
 * - KeywordSearchInput - The input type for the keywordSearch function.
 * - KeywordSearchOutput - The return type for the keywordSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KeywordSearchInputSchema = z.object({
  keyword: z.string().describe('The theological keyword or concept to search for in the KJV Bible.'),
});
export type KeywordSearchInput = z.infer<typeof KeywordSearchInputSchema>;

const KeywordSearchOutputSchema = z.object({
  verses: z
    .array(
      z.object({
        book: z.string().describe('The book of the Bible the verse is from.'),
        chapter: z.number().describe('The chapter number of the verse.'),
        verseNumber: z.number().describe('The verse number.'),
        text: z.string().describe('The text of the verse.'),
        relevanceScore: z
          .number()
          .describe('A score indicating the relevance of the verse to the keyword.'),
      })
    )
    .describe('An array of relevant verses from the KJV Bible.'),
  summary: z.string().describe('A summary of the theological concept and its relevance to the verses.'),
});
export type KeywordSearchOutput = z.infer<typeof KeywordSearchOutputSchema>;

export async function keywordSearch(input: KeywordSearchInput): Promise<KeywordSearchOutput> {
  return keywordSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'keywordSearchPrompt',
  input: {schema: KeywordSearchInputSchema},
  output: {schema: KeywordSearchOutputSchema},
  prompt: `You are a theologian specializing in the King James Version (KJV) Bible.

  Based on the provided keyword, search for relevant verses or passages in the KJV Bible.
  Provide a summary of the theological concept and its relevance to the verses you found.

  Keyword: {{{keyword}}}

  Format the output as a JSON object with a 'verses' array and a 'summary' field.
  Each verse object in the 'verses' array should include the book, chapter, verse number, text, and a relevance score (0-1) indicating how relevant the verse is to the keyword.
  The 'summary' field should provide a concise theological analysis of the keyword and its significance in relation to the found verses.
  `,
});

const keywordSearchFlow = ai.defineFlow(
  {
    name: 'keywordSearchFlow',
    inputSchema: KeywordSearchInputSchema,
    outputSchema: KeywordSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
