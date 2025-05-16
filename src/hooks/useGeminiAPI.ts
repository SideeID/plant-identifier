import { useState } from 'react';
import {
  identifyPlantFromImage,
  getMockPlantIdentification,
} from '../services/plantIdentifier';
import {
  identifyRecipeFromImage,
  getMockRecipeIdentification,
} from '../services/recipeIdentifier';
import { PlantIdentificationResult } from '../types/plants';
import { RecipeIdentificationResult } from '../types/recipes';

interface UseGeminiAPIReturn {
  isLoading: boolean;
  error: string | null;
  identifyPlant: (
    imageUri: string,
    useMock?: boolean,
  ) => Promise<PlantIdentificationResult | null>;
  identifyRecipe: (
    imageUri: string,
    useMock?: boolean,
  ) => Promise<RecipeIdentificationResult | null>;
}

export const useGeminiAPI = (): UseGeminiAPIReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const identifyPlant = async (
    imageUri: string,
    useMock: boolean = false,
  ): Promise<PlantIdentificationResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return getMockPlantIdentification();
      }

      const result = await identifyPlantFromImage(imageUri);
      return result;
    } catch (err) {
      console.error('Error identifying plant:', err);
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to identify plant';
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  const identifyRecipe = async (
    imageUri: string,
    useMock: boolean = false,
  ): Promise<RecipeIdentificationResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return getMockRecipeIdentification();
      }

      const result = await identifyRecipeFromImage(imageUri);
      return result;
    } catch (err) {
      console.error('Error identifying recipe:', err);
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to identify recipe';
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    identifyPlant,
    identifyRecipe,
  };
};
