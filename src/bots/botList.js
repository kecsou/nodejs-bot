const { v4 } = require('uuid');

const botList = [];

/**
 * 
 * @param {string} name 
 * @param {string} description 
 */
function addBotToList(name = '', description = '') {
  botList.push({
    description,
    id: v4(),
    name,
  });
}

module.exports = {
  addBotToList,
  botList
};
