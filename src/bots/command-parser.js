const {
  pattern: patternYoutube,
  bot: botYoutube,
} = require('./youtube');

const {
  pattern: patternTMDB,
  searchByName
} = require('./tmdb');

const {
  pattern: patternWeatherstack,
  getMeteoByTown,
} = require('./weatherstack');

const {
  pattern: patternTranslate,
  translateText,
} = require('./translate');

module.exports = (message = '') => {
  if (patternYoutube.test(message)) {
    return botYoutube(message.replace(patternYoutube, ''));
  }

  if (patternTMDB.test(message)) {
    return searchByName(message.replace(patternTMDB, ''));
  }

  if (patternWeatherstack.test(message)) {
    return getMeteoByTown(message.replace(patternWeatherstack, ''));
  }

  if (patternTranslate.test(message)) {
    const targetAndMessage = message.replace(patternTranslate, '');
    const target = targetAndMessage.split(' ')[0].trim();
    const textToTranslate = targetAndMessage.replace(target, '').trim();
    return translateText(target, textToTranslate);
  }

  return Promise.resolve(null);
};
