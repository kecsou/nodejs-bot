
/**
 * @param {Object} messageDTO
 * @param {string} from
 * @desc 
 */
const messageFormater = (messageDTO, id = '', from = '') => {
  return {
    date: new Date(),
    from,
    id,
    ...messageDTO,
  };
};

module.exports = {
  messageFormater,
};
