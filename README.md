# Plant & Recipe Identifier

A React Native app to identify plants and suggest recipes using AI (Gemini API). Built with Expo, TypeScript, and modern UI libraries.

## Features

- Identify plants from camera or gallery images
- Suggest recipes based on detected ingredients
- Modern, beautiful UI with smooth navigation
- Works on Android, iOS, and web (via Expo)

## Screens

- **Home:** Entry point, choose plant or recipe identification
- **Plant Camera:** Take/select a photo to identify a plant
- **Plant Result:** See plant identification results
- **Recipe Camera:** Take/select a photo of ingredients for recipe suggestions
- **Recipe Result:** View detected ingredients and suggested recipes

## Tech Stack

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [@react-navigation](https://reactnavigation.org/)
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)
- [react-native-paper](https://callstack.github.io/react-native-paper/)
- [nativewind](https://www.nativewind.dev/)

## Project Structure

- `src/screens/` — App screens (Home, PlantCamera, PlantResult, RecipeCamera, RecipeResult)
- `src/api/` — API config and Gemini integration
- `src/hooks/` — Custom React hooks
- `src/services/` — Business logic for plant/recipe identification
- `src/theme/` — Colors, spacing, typography
- `src/types/` — TypeScript types
- `src/utils/` — Utility functions

## License

MIT
