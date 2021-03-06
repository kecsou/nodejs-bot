const axios = require('axios');
const { v4: uuidV4 } = require('uuid');

const { addBotToList } =  require('./botList');

const pattern = /^#tmdb\s{0,}/i;

const botName = 'TMDB';

addBotToList(botName, '#tmdb <movie name>');

const searchByName = (name = '') => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.tmdbKey}&language=en-US&page=1&include_adult=false&query=${name}`;
  return axios.get(url)
    .then(({ data: { results } }) => {
      if (results.length === 0) {
        return {
          date: new Date(),
          from: botName,
          id: uuidV4(),
          query: name,
          type: 'noresultfound',
        };
      }

      return {
        date: new Date(),
        from: botName,
        id: uuidV4(),
        items: results.map((item) => ({
          id: uuidV4(),
          overview: item.overview,
          poster_path: item.poster_path,
          release_date: item.release_date,
          title: item.title,
          vote_average: item.vote_average,
          vote_count: item.vote_count,
        })),
        name,
        type: 'tmdb',
      };
    })
    .catch((e) => {
      console.error(e);
      return {
        id: uuidV4(),
        date: new Date(),
        from: botName,
        type: 'unexpectederror',
        query: name,
      };
    });
};

const searchByKeyword = (keyword = '', page = '1', adult = false) => {

};

module.exports = {
  pattern,
  searchByName,
  searchByKeyword,
};
