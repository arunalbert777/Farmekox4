// fertilizer-identification-recommendation.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying fertilizer from a barcode image and providing usage recommendations.
 *
 * - identifyFertilizerAndRecommend - A function that takes a barcode image and crop information to identify the fertilizer and provide recommendations.
 * - FertilizerIdentificationAndRecommendationInput - The input type for the identifyFertilizerAndRecommend function.
 * - FertilizerIdentificationAndRecommendationOutput - The return type for the identifyFertilizerAndRecommend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerIdentificationAndRecommendationInputSchema = z.object({
  barcodePhotoDataUri: z
    .string()
    .describe(
      "A photo of the fertilizer barcode, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  cropType: z.string().describe('The type of crop the fertilizer will be used for.'),
  location: z.string().describe('The location where the crop is being grown.'),
  weatherConditions: z.string().describe('The current weather conditions at the location.'),
});
export type FertilizerIdentificationAndRecommendationInput = z.infer<
  typeof FertilizerIdentificationAndRecommendationInputSchema
>;

const FertilizerIdentificationAndRecommendationOutputSchema = z.object({
  fertilizerIdentification: z
    .string()
    .describe('The identified fertilizer name and details.'),
  usageRecommendations: z
    .string()
    .describe('Recommendations on how to use the fertilizer for the specified crop.'),
});

export type FertilizerIdentificationAndRecommendationOutput = z.infer<
  typeof FertilizerIdentificationAndRecommendationOutputSchema
>;

export async function identifyFertilizerAndRecommend(
  input: FertilizerIdentificationAndRecommendationInput
): Promise<FertilizerIdentificationAndRecommendationOutput> {
  return fertilizerIdentificationAndRecommendationFlow(input);
}

const fertilizerIdentificationAndRecommendationPrompt = ai.definePrompt({
  name: 'fertilizerIdentificationAndRecommendationPrompt',
  input: {schema: FertilizerIdentificationAndRecommendationInputSchema},
  output: {schema: FertilizerIdentificationAndRecommendationOutputSchema},
  prompt: `You are an AI assistant helping farmers optimize their fertilization practices.

You will receive a photo of a fertilizer barcode, the crop type, the location, and the current weather conditions.
Your goal is to identify the fertilizer from the barcode image and provide recommendations on its usage for the specified crop.

Crop Type: {{{cropType}}}
Location: {{{location}}}
Weather Conditions: {{{weatherConditions}}}
Barcode Photo: {{media url=barcodePhotoDataUri}}

Provide the fertilizer identification and usage recommendations in a clear and concise manner.
`,
});

const fertilizerIdentificationAndRecommendationFlow = ai.defineFlow(
  {
    name: 'fertilizerIdentificationAndRecommendationFlow',
    inputSchema: FertilizerIdentificationAndRecommendationInputSchema,
    outputSchema: FertilizerIdentificationAndRecommendationOutputSchema,
  },
  async input => {
    const {output} = await fertilizerIdentificationAndRecommendationPrompt(input);
    return output!;
  }
);
