const { google } = require('googleapis');
const { v4: uuidV4 } = require('uuid');
const { addBotToList } =  require('./botList');

/**
 * @desc Use for recognize an intended message for the youtube bot
 */
const pattern = /^#y\s{0,}?/;

const botName = 'bot-youtube';

addBotToList(botName, 'Search any video on youtube');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.youtubeKey,
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
  });
};

module.exports = {
  bot,
  pattern,
};
