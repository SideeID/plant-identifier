import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { PlantIdentificationResult } from '../types/plants';
import { RecipeIdentificationResult } from '../types/recipes';
import * as FileSystem from 'expo-file-system';
import { API_CONFIG } from './config';
import { imageUriToBase64, createFilePart } from '../services/imageProcessing';
import {
  plantIdentificationPrompt,
  recipeIdentificationPrompt,
} from '../services/Prompts';

const genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);

const sendImageToGemini = async (
  image: string,
  prompt: string,
  modelVersion: string = 'gemini-1.5-flash',
) => {
  try {
    const imagePart = await createFilePart(image);

    const model = genAI.getGenerativeModel({ model: modelVersion });

    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 2048,
    };

    // Configure safety settings
    // const safetySettings = [
    //   {
    //     category: HarmCategory.HARASSMENT,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    //   {
    //     category: HarmCategory.HATE_SPEECH,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    //   {
    //     category: HarmCategory.SEXUALLY_EXPLICIT,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    //   {
    //     category: HarmCategory.DANGEROUS_CONTENT,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    // ];

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }, imagePart],
        },
      ],
      generationConfig,
      // safetySettings,
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export const identifyPlant = async (
  imageUri: string,
): Promise<PlantIdentificationResult> => {
  const prompt = plantIdentificationPrompt;

  try {
    const result = await sendImageToGemini(imageUri, prompt);
    console.log('Raw Gemini response for plant:', result);

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : result;

    const parsedResult = JSON.parse(jsonStr);

    return {
      ...parsedResult,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error identifying plant:', error);
    throw error;
  }
};

export const identifyRecipe = async (
  imageUri: string,
): Promise<RecipeIdentificationResult> => {
  const prompt = recipeIdentificationPrompt;

  try {
    const result = await sendImageToGemini(imageUri, prompt);
    console.log('Raw Gemini response for recipe:', result);

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : result;

    const parsedResult = JSON.parse(jsonStr);

    return {
      ...parsedResult,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error identifying recipe ingredients:', error);
    throw error;
  }
};
