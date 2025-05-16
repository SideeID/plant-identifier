import { EXPO_PUBLIC_GEMINI_API_KEY } from '@env';

if (!EXPO_PUBLIC_GEMINI_API_KEY) {
  console.error('EXPO_PUBLIC_GEMINI_API_KEY is not defined in .env file');
}

export const API_CONFIG = {
  GEMINI_API_KEY: EXPO_PUBLIC_GEMINI_API_KEY || '',
};
