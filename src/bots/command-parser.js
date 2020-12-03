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

const {
  pattern: patterWhereAmI,
  whereAmI,
} = require('./whereAmI');

const {
  pattern: patternMapSearch,
  mapSearch
} = require('./mapSearch');

module.exports = (message = '', user) => {
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

  if (patterWhereAmI.test(message)) {
    return whereAmI(user.latitude, user.longitude);
  }

  if (patternMapSearch.test(message)) {
    return mapSearch(message.replace(patternMapSearch, ''), user.latitude, user.longitude);
  }

  return Promise.resolve(null);
};
