import { config } from 'dotenv';
config();

import '@/ai/flows/crop-recommendation-chat.ts';
import '@/ai/flows/summarize-agricultural-news.ts';
import '@/ai/flows/fertilizer-identification-recommendation.ts';
import '@/ai/flows/pest-disease-identification.ts';
import '@/ai/flows/text-to-speech.ts';
