export interface Recipe {
  id?: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine?: string;
  tags?: string[];
  imageUri?: string;
}

export interface Ingredient {
  id?: string;
  name: string;
  amount: string;
  unit?: string;
}

export interface RecipeIdentificationResult {
  detectedIngredients: Ingredient[];
  suggestedRecipes: Recipe[];
  confidence: number;
  timestamp: Date;
}
