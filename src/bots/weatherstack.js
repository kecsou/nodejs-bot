const axios = require('axios');
const { addBotToList } = require('./botList');
const { v4: uuidV4 } = require('uuid');

const pattern = /^#weather\s{0,}/i;
const botName = 'Weatherstack';
addBotToList(botName, '#weather <town name>');

const getMeteoByTown = (town = '') => {
  const queries = new URLSearchParams({
    access_key: process.env.weatherstack,
    query: town
  });

  return axios.get(`http://api.weatherstack.com/current?${queries}`)
    .then(({ data }) => {
      if (data.error) {
        throw data.error;
      }

      let weatherIcon = null;
      let description = null;
      const windSpeed = data.current.wind_speed;
      const { humidity, temperature } = data.current;
      const { localtime, name } = data.location;

      if (data.current.weather_icons.length > 0) {
        weatherIcon = data.current.weather_icons[0];
      }

      if (data.current.weather_descriptions.length > 0) {
        description = data.current.weather_descriptions[0];
      }

      return {
        id: uuidV4(),
        date: new Date(),
        description,
        from: botName,
        humidity,
        localtime,
        query: name,
        temperature,
        type: 'weatherstack',
        weatherIcon,
        windSpeed,
      };
    })
    .catch((e) => {
      console.error('getMeteoTown', e);
      return {
        id: uuidV4(),
        date: new Date(),
        from: botName,
        type: 'unexpectederror',
        query: town,
      };
    });
};

module.exports = {
  pattern,
  getMeteoByTown
};
