module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add plugins with proper syntax
      'nativewind/babel',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
