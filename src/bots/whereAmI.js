const { v4: uuidV4 } = require('uuid');
const { addBotToList } =  require('./botList');

const pattern  = /^#whereami/i

addBotToList('WhereAmI', '#whereami');

const whereAmI = (latitude = 48.8534, longitude = 2.3488) => ({
  apiKey: process.env.googleApiKey,
  id: uuidV4(),
  lat: latitude,
  lng: longitude,
  type: 'whereami',
});

module.exports = {
  pattern,
  whereAmI,
};
