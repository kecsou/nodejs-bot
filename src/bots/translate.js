const {Translate} = require('@google-cloud/translate').v2;
const { v4: uuidV4 } = require('uuid');
const { addBotToList } =  require('./botList');

const pattern  = /^#translate /i

addBotToList('Translator', '#translate <target language> <your message>');

const translate = new Translate({
  key: process.env.googleApiKey,
});

/**
 * 
 * @param {string} target 
 * @param {string} text 
 */
const translateText = async (target = 'fr', text = '',) => {
  try {
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];

    return {
      date: new Date(),
      id: uuidV4(),
      translations,
      type: 'translation',
      source: text,
    };
  } catch(e) {
    console.error(e);
    return null;
  }
};

module.exports = {
  pattern,
  translateText,
};
