'use server';

/**
 * @fileOverview Summarizes the latest agricultural news related to crop prices, weather patterns, and farming techniques.
 *
 * - summarizeAgriculturalNews - A function that handles the summarization of agricultural news.
 * - SummarizeAgriculturalNewsInput - The input type for the summarizeAgriculturalNews function.
 * - SummarizeAgriculturalNewsOutput - The return type for the summarizeAgriculturalNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAgriculturalNewsInputSchema = z.object({
  query: z
    .string()
    .describe(
      'The query for agricultural news, can include topics like crop prices, weather patterns, and farming techniques.'
    ),
});
export type SummarizeAgriculturalNewsInput = z.infer<typeof SummarizeAgriculturalNewsInputSchema>;

const SummarizeAgriculturalNewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the latest agricultural news.'),
});
export type SummarizeAgriculturalNewsOutput = z.infer<typeof SummarizeAgriculturalNewsOutputSchema>;

export async function summarizeAgriculturalNews(input: SummarizeAgriculturalNewsInput): Promise<SummarizeAgriculturalNewsOutput> {
  return summarizeAgriculturalNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAgriculturalNewsPrompt',
  input: {schema: SummarizeAgriculturalNewsInputSchema},
  output: {schema: SummarizeAgriculturalNewsOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing agricultural news.

  Summarize the latest agricultural news based on the user's query. Focus on crop prices, weather patterns, and farming techniques.

  Query: {{{query}}}
  `,
});

const summarizeAgriculturalNewsFlow = ai.defineFlow(
  {
    name: 'summarizeAgriculturalNewsFlow',
    inputSchema: SummarizeAgriculturalNewsInputSchema,
    outputSchema: SummarizeAgriculturalNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
