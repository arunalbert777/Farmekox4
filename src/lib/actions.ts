'use server';

import {
  cropRecommendationViaChat,
  type CropRecommendationViaChatInput,
} from '@/ai/flows/crop-recommendation-chat';
import {
    identifyFertilizerAndRecommend,
    type FertilizerIdentificationAndRecommendationInput
} from '@/ai/flows/fertilizer-identification-recommendation'
import {
  identifyPestOrDisease,
  type IdentifyPestOrDiseaseInput,
} from '@/ai/flows/pest-disease-identification';
import {
  textToSpeech,
  type TextToSpeechInput,
} from '@/ai/flows/text-to-speech';

export async function getAiRecommendation(
  prevState: any,
  formData: FormData
): Promise<{ id: string; recommendation: string; language: string } | { error: string }> {
  try {
    const language = formData.get('language') as 'en' | 'kn';
    const input: CropRecommendationViaChatInput = {
        userInput: formData.get('userInput') as string,
        language: language,
    };
    const result = await cropRecommendationViaChat(input);
    return { id: `${Date.now()}-${Math.random()}`, recommendation: result.recommendation, language: language };
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

export async function getPestOrDiseaseId(
  prevState: any,
  formData: FormData
): Promise<
  | { result: { isPlant: boolean; isHealthy: boolean; details: string } }
  | { error: string }
> {
  try {
    const input: IdentifyPestOrDiseaseInput = {
      photoDataUri: formData.get('photoDataUri') as string,
    };
    const result = await identifyPestOrDisease(input);
    return {
      result: {
        isPlant: result.identification.isPlant,
        isHealthy: result.diagnosis.isHealthy,
        details: `**Plant:** ${result.identification.commonName} (${result.identification.latinName})\n\n**Diagnosis:** ${result.diagnosis.diagnosis}`,
      },
    };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to identify pest or disease from AI.' };
  }
}

export async function getAudioForText(
  prevState: any,
  formData: FormData
): Promise<{ audio: string } | { error: string }> {
  try {
    const input: TextToSpeechInput = {
      text: formData.get('text') as string,
      language: formData.get('language') as 'en' | 'kn',
    };
    const result = await textToSpeech(input);
    return { audio: result.audio };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate audio.' };
  }
}
