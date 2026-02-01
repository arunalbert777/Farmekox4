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
  location: z.string().describe('The location of the farm.'),
  weatherConditions: z.string().describe('The current weather conditions.'),
  soilConditions: z.string().describe('The soil conditions of the farm.'),
  cropType: z.string().optional().describe('Optional: The type of crop the user is interested in.'),
  fertilizerIngredients: z.string().optional().describe('Optional: Identified ingredients of the fertilizer the user has.'),
  userInput: z.string().describe('The user input / question about crop recommendations.'),
});

export type CropRecommendationViaChatInput = z.infer<typeof CropRecommendationViaChatInputSchema>;

const CropRecommendationViaChatOutputSchema = z.object({
  recommendation: z.string().describe('The crop recommendation based on the input parameters.'),
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

  Based on the following information, provide a crop recommendation to the user:

  Location: {{{location}}}
  Weather Conditions: {{{weatherConditions}}}
  Soil Conditions: {{{soilConditions}}}
  Crop Type (if specified): {{{cropType}}}
  Fertilizer Ingredients (if specified): {{{fertilizerIngredients}}}

  User Input: {{{userInput}}}

  Please provide a clear and concise recommendation.
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
