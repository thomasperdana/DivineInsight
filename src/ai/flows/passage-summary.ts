'use server';

/**
 * @fileOverview Summarizes a selected passage of the KJV Bible.
 *
 * - summarizePassage - A function that summarizes the passage.
 * - SummarizePassageInput - The input type for the summarizePassage function.
 * - SummarizePassageOutput - The return type for the summarizePassage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePassageInputSchema = z.object({
  passageText: z.string().describe('The text of the Bible passage to summarize.'),
});
export type SummarizePassageInput = z.infer<typeof SummarizePassageInputSchema>;

const SummarizePassageOutputSchema = z.object({
  summary: z.string().describe('A summary of the key themes and messages of the passage.'),
});
export type SummarizePassageOutput = z.infer<typeof SummarizePassageOutputSchema>;

export async function summarizePassage(input: SummarizePassageInput): Promise<SummarizePassageOutput> {
  return summarizePassageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePassagePrompt',
  input: {schema: SummarizePassageInputSchema},
  output: {schema: SummarizePassageOutputSchema},
  prompt: `You are a theologian summarizing passages from the King James Version of the Bible.

  Summarize the following passage, identifying its key themes and messages:

  {{passageText}}`,
});

const summarizePassageFlow = ai.defineFlow(
  {
    name: 'summarizePassageFlow',
    inputSchema: SummarizePassageInputSchema,
    outputSchema: SummarizePassageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
