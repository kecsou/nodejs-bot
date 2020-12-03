const { Client } = require("@googlemaps/google-maps-services-js");
const { v4: uuidV4 } = require('uuid');
const { addBotToList } = require("./botList");

const pattern = /^#map\s{0,}/i

const botName = 'MapSearch';

addBotToList(botName, '#map <Your search>');

const client = new Client({});

const mapSearch = (query, latitude, longitude) => {
  return client.textSearch({
    params: {
      key: process.env.googleApiKey,
      location: {
        latitude,
        longitude
      },
      query,
      shop: true,
    }
  })
  .then(({ data }) => {

    if (data.results.length === 0) {
      return {
        date: new Date(),
        from: botName,
        id: uuidV4(),
        notfound: true,
        query,
        type: 'mapsearch',
      };
    }

    return {
      apiKey: process.env.googleApiKey,
      date: new Date(),
      from: botName,
      id: uuidV4(),
      items: data.results.map((r) => {
        const openNow = r.opening_hours && r.opening_hours.open_now;
        const openingWeekDays = r.opening_hours && r.opening_hours.weekday_text;
        const address = r.formatted_address;

        return {
          address,
          id: uuidV4(),
          icon: r.icon,
          name: r.name,
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
          rate: r.rating,
          numberRate: r.user_ratings_total,
          internationalPhoneNumber: r.international_phone_number,
          openNow,
          types: r.types,
          openingWeekDays,
        };
      }),
      lat: latitude,
      lng: longitude,
      type: 'mapsearch',
      notfound: false
    };
  })
  .catch((error) => {
    console.error(error);
    return null;
  });
};

module.exports = {
  pattern,
  mapSearch,
};
