'use server';
/**
 * @fileOverview An AI agent for finding cross-references for a given Bible verse, similar to Thompson Chain References.
 *
 * - findCrossReferences - A function that initiates the cross-reference finding process.
 * - CrossReferenceInput - The input type for the findCrossReferences function.
 * - CrossReferenceOutput - The return type for the findCrossReferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrossReferenceInputSchema = z.object({
  bookName: z.string().describe('The name of the book of the Bible for the verse.'),
  chapter: z.number().describe('The chapter number of the verse.'),
  verseNumber: z.number().describe('The verse number.'),
  verseText: z.string().describe('The text of the Bible verse to find cross-references for.'),
});
export type CrossReferenceInput = z.infer<typeof CrossReferenceInputSchema>;

const CrossReferenceOutputSchema = z.object({
  crossReferences: z
    .array(
      z.object({
        book: z.string().describe('The book of the referenced Bible verse.'),
        chapter: z.number().describe('The chapter number of the referenced verse.'),
        verseNumber: z.number().describe('The verse number of the referenced verse.'),
        text: z.string().describe('The text of the referenced KJV verse.'),
        connection: z
          .string()
          .describe(
            'A brief explanation of how this verse connects to the original verse, its theme, or keywords (e.g., "Love of God", "Faith", "Prophecy of Messiah").'
          ),
      })
    )
    .describe('An array of cross-referenced KJV verses and their thematic connections.'),
  originalVerseContext: z
    .string()
    .describe(
      "A brief summary of the original verse's main themes or keywords that led to these cross-references."
    ),
});
export type CrossReferenceOutput = z.infer<typeof CrossReferenceOutputSchema>;

export async function findCrossReferences(input: CrossReferenceInput): Promise<CrossReferenceOutput> {
  return crossReferenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crossReferencePrompt',
  input: {schema: CrossReferenceInputSchema},
  output: {schema: CrossReferenceOutputSchema},
  prompt: `You are an expert theologian and Bible scholar with deep knowledge of the King James Version (KJV) Bible and chain reference systems like the Thompson Chain Reference.

Given the following KJV Bible verse:
Book: {{{bookName}}}
Chapter: {{{chapter}}}
Verse: {{{verseNumber}}}
Text: "{{{verseText}}}"

1. Identify the key theological themes, concepts, people, places, or significant keywords in this verse.
2. Find up to 5-7 other KJV verses that are strongly related to these identified themes/concepts. These cross-references should illuminate the original verse, show parallel passages, contrasting ideas, or further developments of the theme.
3. For each cross-reference, provide the book, chapter, verse number, and the full KJV text of the verse.
4. For each cross-reference, briefly explain the connection or the shared theme with the original verse (e.g., "Illustrates God's mercy," "Parallel teaching on forgiveness," "Prophetic fulfillment of...").
5. Provide a concise summary of the original verse's main themes or keywords that guided your selection of cross-references.

Prioritize meaningful theological connections over simple word matches. Ensure all verse texts are from the KJV.
Format the output as a JSON object according to the provided schema.
`,
});

const crossReferenceFlow = ai.defineFlow(
  {
    name: 'crossReferenceFlow',
    inputSchema: CrossReferenceInputSchema,
    outputSchema: CrossReferenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);