export enum Routes {
  Home = 'Home',
  PlantCamera = 'PlantCamera',
  PlantResult = 'PlantResult',
  RecipeCamera = 'RecipeCamera',
  RecipeResult = 'RecipeResult',
}

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

export const ROUTES = Routes;
