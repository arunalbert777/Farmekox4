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
  prevState: any,
  formData: FormData
): Promise<{ recommendation: string } | { error: string }> {
  try {
    const input: CropRecommendationViaChatInput = {
        userInput: formData.get('userInput') as string,
    };
    const result = await cropRecommendationViaChat(input);
    return { recommendation: result.recommendation };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get recommendation from AI.' };
  }
}

export async function getFertilizerId(
    prevState: any,
    formData: FormData
): Promise<{ result: string } | { error: string }> {
    try {
        const input: FertilizerIdentificationAndRecommendationInput = {
            cropType: formData.get('cropType') as string,
            location: formData.get('location') as string,
            weatherConditions: formData.get('weatherConditions') as string,
            // In a real app, you'd get this from a file upload.
            // For demonstration, we're using a placeholder.
            barcodePhotoDataUri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        };

        const result = await identifyFertilizerAndRecommend(input);
        const formattedResult = `**Fertilizer:** ${result.fertilizerIdentification}\n\n**Recommendations:** ${result.usageRecommendations}`;
        return { result: formattedResult };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get fertilizer identification from AI.' };
    }
}
