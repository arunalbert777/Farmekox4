// This is a Genkit flow for providing crop recommendations via chat.
'use server';

/**
 * @fileOverview A Genkit flow for providing crop recommendations via chat.
 *
 * - cropRecommendationViaChat - A function that takes user input and returns crop recommendations.
 * - CropRecommendationViaChatInput - The input type for the cropRecommendationViaChat function.
 * - CropRecommendationViaChatOutput - The return type for the cropRecommendationViaChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationViaChatInputSchema = z.object({
  userInput: z.string().describe('The user input / question about crop recommendations. This should include details like location, weather, soil conditions, and crop type if the user has a preference.'),
});

export type CropRecommendationViaChatInput = z.infer<typeof CropRecommendationViaChatInputSchema>;

const CropRecommendationViaChatOutputSchema = z.object({
  recommendation: z.string().describe('The crop recommendation based on the user input.'),
});

export type CropRecommendationViaChatOutput = z.infer<typeof CropRecommendationViaChatOutputSchema>;

export async function cropRecommendationViaChat(input: CropRecommendationViaChatInput): Promise<CropRecommendationViaChatOutput> {
  return cropRecommendationViaChatFlow(input);
}

const cropRecommendationPrompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationViaChatInputSchema},
  output: {schema: CropRecommendationViaChatOutputSchema},
  prompt: `You are an AI assistant specializing in providing crop recommendations to farmers.

  The user will provide details about their farming conditions in the input. Based on the following user input, provide a clear and concise crop recommendation.

  User Input: {{{userInput}}}
  `,
});

const cropRecommendationViaChatFlow = ai.defineFlow(
  {
    name: 'cropRecommendationViaChatFlow',
    inputSchema: CropRecommendationViaChatInputSchema,
    outputSchema: CropRecommendationViaChatOutputSchema,
  },
  async input => {
    const {output} = await cropRecommendationPrompt(input);
    return output!;
  }
);
