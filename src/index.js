/**
 * @typedef {Object} Message
 * @property {string} from
 * @property {Date} date
 *
 *
 * @typedef {Object} MessageDTO
 *
 */

const dotenv = require('dotenv');
const express = require('express');
const socketIo = require('socket.io');
const { resolve } = require('path');
const { v4: uuidV4 } = require('uuid');

const pathDotEnv = resolve(`${__dirname}/../.env`);

dotenv.config({
  path: pathDotEnv,
});

const apiKeys = [
  'googleApiKey',
  'tmdbKey',
  'weatherstack'
];

for (const apiKey of apiKeys) {
  if (typeof process.env[apiKey] !== 'string') {
    console.error(`Key ${apiKey} not provided as string`);
    process.exit(1);
  }
}

const CommandParser = require('./bots/command-parser');
const { botList } = require('./bots/botList');
const User = require('./User');

const app = express();

const PORT = process.env.port || 80;

const users = [];

/**
 * @type {Message[]}
 */
const messages = [];

const publicPath = resolve(`${__dirname}/../public`);

app.use(express.static(publicPath));

const server = app.listen(PORT, () => {
  console.log(`Chat bot is listenning on port ${PORT}`);
});

const io = socketIo(server);

io.on('connection', (socket) => {
  if (!socket.handshake.query
    || typeof socket.handshake.query !== 'object') {
      console.log(`Unauthorized query ${socket.handshake.query}`);
      socket.disconnect('unauthorized');
    return;
  }

  const {
    description,
    latitude,
    longitude,
    connectionId,
  } = socket.handshake.query;

  if (typeof socket.handshake.query.username !== 'string') {
    console.log(`Unauthorized username ${JSON.stringify(socket.handshake.query)}`);
    socket.disconnect('unauthorized');
    return;
  }

  const username = socket.handshake.query.username.toLocaleLowerCase().trim();

  if (isNaN(latitude)) {
    console.log(`Unauthorized latitude ${JSON.stringify(socket.handshake.query)}`);
    socket.disconnect('unauthorized');
    return;
  }

  if (isNaN(longitude)) {
    console.log(`Unauthorized longitude ${JSON.stringify(socket.handshake.query)}`);
    socket.disconnect('unauthorized');
    return;
  }

  const existingUser = users.find((user) => user.username.toLocaleLowerCase().trim() === username);

  if (existingUser !== undefined) {
    if (existingUser.connectionId !== connectionId) { //User found but and unknow connectionId
      console.log(`Unauthorized username already in use ${JSON.stringify(socket.handshake.query)}`);
      socket.emit('error-authent', `Username ${username} already in use`);
      socket.disconnect();
      return;
    }

  } else { // No user found
    const connectionId = uuidV4();
    const user = new User(connectionId, description, uuidV4(), latitude, longitude, username);
    users.push(user);
    socket.emit('success-authent', connectionId);
  }

  console.log(`User ${username} connected`);

  socket.emit('bots', botList);
  socket.emit('messages', messages);
  io.emit('users', users.map(({ description, id, username }) => ({ description, id, username })));

  socket.on('message-send', async (messageDTO) => {
    try {
      console.log(`User ${username} send a message`);
      console.log('Message content:');
      console.log(JSON.stringify(messageDTO));

      const { content } = messageDTO;
      const user = users.find((user) => user.username === username);
      if (user) {
        const messageResponse = await CommandParser(content, user);
        if (messageResponse !== null) {
          const messageResponseDTO = {
            ...messageResponse,
            by: username,
          };
          messages.push(messageResponseDTO);
          io.emit('message', messageResponseDTO);
        } else {
          const message = {
            date: new Date(),
            id: uuidV4(),
            type: 'plain',
            ...messageDTO,
          };
          messages.push(message);
          io.emit('message', message);
        }
      }
    } catch(e) {
      console.error(e);
      console.log(`Error obtained in ${username} context`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${username} disconnected`);
    const indexUser = users.findIndex((user) => user.username === username);
    if (indexUser !== -1) {
      users.splice(indexUser, 1);
      io.emit('users', users.map(({ description, id, username }) => ({ description, id, username })));
    }
  });
});

app.get('*', (_, res) =>{
  res.sendFile(`${publicPath}/index.html`);
});
