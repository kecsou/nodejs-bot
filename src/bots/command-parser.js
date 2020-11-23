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

  return Promise.resolve(null);
};
