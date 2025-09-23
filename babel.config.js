// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // В SDK 54 нужен плагин Reanimated 3, и он ДОЛЖЕН быть ПОСЛЕДНИМ
    plugins: ['react-native-reanimated/plugin'],
  };
};
