const { google } = require('googleapis');

/**
 * @desc Use for recognize an intended message for the youtube bot
 */
const pattern = /^#y/;

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.youtubeKey,
});

/**
 * 
 * @param {Object} res
 * @desc Exctract videos's identifiers from the youtube response
 */
const formatYoutubeResponse = ({ data: { items = [] } }) => items.map((item) => item.id.videoId);

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
  }).then(formatYoutubeResponse)
    .catch((e) => {
      console.error(e);
    });
};

module.exports = {
  bot,
  pattern,
};
