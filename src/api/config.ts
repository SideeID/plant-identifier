import { GEMINI_API_KEY } from '@env';

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not defined in .env file');
}

export const API_CONFIG = {
  GEMINI_API_KEY: GEMINI_API_KEY || '',
};
