'use server';
/**
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - identifyPestOrDisease - A function that handles the plant diagnosis process.
 * - IdentifyPestOrDiseaseInput - The input type for the identifyPestOrDisease function.
 * - IdentifyPestOrDiseaseOutput - The return type for the identifyPestOrDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPestOrDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyPestOrDiseaseInput = z.infer<typeof IdentifyPestOrDiseaseInputSchema>;

const IdentifyPestOrDiseaseOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the input is a plant.'),
    commonName: z.string().describe('The common name of the identified plant. If not a plant, return "N/A".'),
    latinName: z.string().describe('The Latin name of the identified plant. If not a plant, return "N/A".'),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy. If not a plant, return false.'),
    diagnosis: z.string().describe("The diagnosis of the plant's health, including any pests or diseases found and recommended treatments. If not a plant, return 'Not a plant'."),
  }),
});
export type IdentifyPestOrDiseaseOutput = z.infer<typeof IdentifyPestOrDiseaseOutputSchema>;

export async function identifyPestOrDisease(input: IdentifyPestOrDiseaseInput): Promise<IdentifyPestOrDiseaseOutput> {
  return identifyPestOrDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPestOrDiseasePrompt',
  input: {schema: IdentifyPestOrDiseaseInputSchema},
  output: {schema: IdentifyPestOrDiseaseOutputSchema},
  prompt: `You are an expert botanist specializing in diagnosing plant illnesses, pests, and diseases.

You will use the provided photo to identify the plant and any issues it has.
- First, determine if the image contains a plant. If not, set isPlant to false and return "N/A" for names and "Not a plant" for diagnosis.
- If it is a plant, identify its common and latin name.
- Then, determine if the plant is healthy.
- If the plant is not healthy, provide a detailed diagnosis of the issue (e.g., nutrient deficiency, pest infestation, fungal disease) and suggest potential treatments.

Photo: {{media url=photoDataUri}}`,
});

const identifyPestOrDiseaseFlow = ai.defineFlow(
  {
    name: 'identifyPestOrDiseaseFlow',
    inputSchema: IdentifyPestOrDiseaseInputSchema,
    outputSchema: IdentifyPestOrDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
