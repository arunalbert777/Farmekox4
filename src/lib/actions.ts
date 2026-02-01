'use server';

import {
  cropRecommendationViaChat,
  type CropRecommendationViaChatInput,
} from '@/ai/flows/crop-recommendation-chat';
import {
    identifyFertilizerAndRecommend,
    type FertilizerIdentificationAndRecommendationInput
} from '@/ai/flows/fertilizer-identification-recommendation'

export async function getAiRecommendation(
  input: CropRecommendationViaChatInput
): Promise<{ recommendation: string } | { error: string }> {
  try {
    const result = await cropRecommendationViaChat(input);
    return { recommendation: result.recommendation };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get recommendation from AI.' };
  }
}

export async function getFertilizerId(
    input: FertilizerIdentificationAndRecommendationInput
): Promise<{ result: string } | { error: string }> {
    try {
        // In a real app, you'd get this from a file upload.
        // For demonstration, we're using a placeholder.
        if (!input.barcodePhotoDataUri) {
            input.barcodePhotoDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        }

        const result = await identifyFertilizerAndRecommend(input);
        const formattedResult = `**Fertilizer:** ${result.fertilizerIdentification}\n\n**Recommendations:** ${result.usageRecommendations}`;
        return { result: formattedResult };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get fertilizer identification from AI.' };
    }
}
