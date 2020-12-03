const { google } = require('googleapis');
const { v4: uuidV4 } = require('uuid');
const { addBotToList } =  require('./botList');

/**
 * @desc Use for recognize an intended message for the youtube bot
 */
const pattern = /^#youtube\s{0,}/i;

const botName = 'Youtube';

addBotToList(botName, '#youtube <video name>');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.googleApiKey,
});

/**
 *
 * @param {stirng} message
 * @desc The youtube bot entrypoint
 */
const bot = (message = '') => {
  return youtube.search.list({
    part: 'snippet',
    q: message,
    type: 'video',
  })
  .then(({ data: { items = [] } }) => ({
    date: new Date(),
    from: botName,
    id: uuidV4(),
    items: items.map((item) => ({
      description: item.snippet.description,
      id: item.id.videoId,
      title: item.snippet.title
    })),
    type: 'youtube',
    query: message,
  }))
  .catch((e) => {
    console.error(e);
    return {
      id: uuidV4(),
      date: new Date(),
      from: botName,
      type: 'unexpectederror',
      query: message,
    };
  });
};

module.exports = {
  bot,
  pattern,
};
