// максимально простой и стабильный конфиг
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // плагинов специально нет, чтобы исключить конфликтов
    // (мы не используем Reanimated/Worklets в этом MVP)
  };
};
