import { RecipeIdentificationResult } from '../types/recipes';
import { identifyRecipe } from '../api/gemini';
import { compressImage, validateImage } from './imageProcessing';

export const identifyRecipeFromImage = async (
  imageUri: string,
): Promise<RecipeIdentificationResult> => {
  try {
    if (!validateImage(imageUri)) {
      throw new Error('Invalid image format. Please use JPG or PNG.');
    }

    const compressedImageUri = await compressImage(imageUri);

    const result = await identifyRecipe(compressedImageUri);

    return result;
  } catch (error) {
    console.error('Error in recipe identification service:', error);
    throw error;
  }
};

export const getMockRecipeIdentification = (): RecipeIdentificationResult => {
  return {
    detectedIngredients: [
      { name: 'Tomato', amount: '3', unit: 'medium' },
      { name: 'Onion', amount: '1', unit: 'large' },
      { name: 'Garlic', amount: '2', unit: 'cloves' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Bell pepper', amount: '1', unit: 'medium' },
    ],
    suggestedRecipes: [
      {
        name: 'Simple Tomato Sauce',
        description:
          'A quick and flavorful tomato sauce that can be used for pasta or as a base for other dishes.',
        ingredients: [
          { name: 'Tomato', amount: '3', unit: 'medium' },
          { name: 'Onion', amount: '1', unit: 'large' },
          { name: 'Garlic', amount: '2', unit: 'cloves' },
          { name: 'Olive oil', amount: '2', unit: 'tbsp' },
          { name: 'Salt', amount: '1/2', unit: 'tsp' },
          { name: 'Black pepper', amount: '1/4', unit: 'tsp' },
          { name: 'Basil', amount: '1', unit: 'tbsp' },
        ],
        instructions: [
          'Dice the onion and mince the garlic.',
          'Heat olive oil in a pan over medium heat.',
          'Add onion and cook until translucent, about 5 minutes.',
          'Add garlic and cook for 30 seconds until fragrant.',
          'Add diced tomatoes and cook until soft, about 10 minutes.',
          'Season with salt, pepper, and basil.',
          'Simmer for 10-15 minutes until thickened.',
        ],
        prepTime: 10,
        cookTime: 25,
        servings: 4,
        difficulty: 'easy',
      },
      {
        name: 'Stuffed Bell Peppers',
        description:
          'Delicious bell peppers stuffed with tomato, onion, and garlic mixture.',
        ingredients: [
          { name: 'Bell pepper', amount: '1', unit: 'medium' },
          { name: 'Tomato', amount: '2', unit: 'medium' },
          { name: 'Onion', amount: '1/2', unit: 'large' },
          { name: 'Garlic', amount: '1', unit: 'clove' },
          { name: 'Olive oil', amount: '1', unit: 'tbsp' },
          { name: 'Rice', amount: '1/2', unit: 'cup' },
          { name: 'Salt', amount: '1/2', unit: 'tsp' },
          { name: 'Black pepper', amount: '1/4', unit: 'tsp' },
        ],
        instructions: [
          'Preheat oven to 375°F (190°C).',
          'Cook rice according to package directions.',
          'Cut the top off the bell pepper and remove seeds.',
          'Dice tomato and onion, mince garlic.',
          'Sauté onion and garlic in olive oil until soft.',
          'Add diced tomato and cook for 5 minutes.',
          'Mix with cooked rice, salt, and pepper.',
          'Stuff the mixture into the bell pepper.',
          'Bake for 25-30 minutes until pepper is tender.',
        ],
        prepTime: 15,
        cookTime: 30,
        servings: 1,
        difficulty: 'medium',
      },
    ],
    confidence: 0.85,
    timestamp: new Date(),
  };
};
