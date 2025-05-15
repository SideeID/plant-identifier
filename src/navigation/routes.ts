// Define the screen names as constants
export enum Routes {
  Home = 'Home',
  PlantCamera = 'PlantCamera',
  PlantResult = 'PlantResult',
  RecipeCamera = 'RecipeCamera',
  RecipeResult = 'RecipeResult',
}

// Define the parameter types for each route
export type RootStackParamList = {
  [Routes.Home]: undefined;
  [Routes.PlantCamera]: undefined;
  [Routes.PlantResult]: {
    imageUri: string;
    useMockData?: boolean;
  };
  [Routes.RecipeCamera]: undefined;
  [Routes.RecipeResult]: {
    imageUri: string;
    useMockData?: boolean;
  };
};

// Export the route names for use in the app
export const ROUTES = Routes;
