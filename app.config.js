import { app } from './app.json';

export default ({ config }) => {
  return {
    ...app.expo,
    extra: {
      ...app.expo.extra,
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      eas: app.expo.extra.eas,
    },
  };
};
