'use server';

/**
 * @fileOverview Explains the theological meaning of a Bible verse.
 *
 * - explainVerse - A function that explains the theological meaning of a Bible verse.
 * - ExplainVerseInput - The input type for the explainVerse function.
 * - ExplainVerseOutput - The return type for the explainVerse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainVerseInputSchema = z.object({
  verse: z.string().describe('The Bible verse to explain.'),
  question: z
    .string()
    .optional()
    .describe('The specific question about the verse to answer.'),
});
export type ExplainVerseInput = z.infer<typeof ExplainVerseInputSchema>;

const ExplainVerseOutputSchema = z.object({
  explanation: z.string().describe('The theological explanation of the verse.'),
});
export type ExplainVerseOutput = z.infer<typeof ExplainVerseOutputSchema>;

export async function explainVerse(input: ExplainVerseInput): Promise<ExplainVerseOutput> {
  return explainVerseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainVersePrompt',
  input: {schema: ExplainVerseInputSchema},
  output: {schema: ExplainVerseOutputSchema},
  prompt: `You are a theologian with deep knowledge of the King James Version of the Bible.

  Please provide a theological explanation of the following verse, using the King James Version as your primary reference:

  Verse: {{{verse}}}

  {{#if question}}
  In addition, answer the following question about the verse:

  Question: {{{question}}}
  {{/if}}`,
});

const explainVerseFlow = ai.defineFlow(
  {
    name: 'explainVerseFlow',
    inputSchema: ExplainVerseInputSchema,
    outputSchema: ExplainVerseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
