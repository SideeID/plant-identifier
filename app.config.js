import appJson from './app.json';

export default ({ config }) => {
  return {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      eas: appJson.expo.extra?.eas,
    },
  };
};
