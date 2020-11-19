
/**
 * 
 * @param {*} socket 
 * @param {Map} users 
 * @desc 
 */
const getUserBySocket = (socket, users = new Map()) => {
  const entries = Array.from(users.entries());
  const keyValue = entries.find((keyValue) => {
    const user = keyValue[1];
    return user.socket === socket;
  });
  const user = keyValue[1];
  return user;
};

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
  getUserBySocket,
  messageFormater,
};
