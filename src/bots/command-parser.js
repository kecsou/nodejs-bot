const {
  pattern: patternYoutube,
  bot: botYoutube,
} = require('./youtube');


module.exports = (message = '', user = null) => {
  if (patternYoutube.test(message)) {
    return botYoutube(message.replace(patternYoutube, ''));
  }

  return Promise.resolve(null);
};
