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

const CommandParser = require('./bots/command-parser');
const { botList } = require('./bots/botList');
const User = require('./User');

const app = express();

const PORT = process.env.port || 8080;

let users = [];

/**
 * @type {Message[]}
 */
const messages = [];

app.use(express.static(resolve(`${__dirname}/../public`)));

const server = app.listen(PORT, () => {
  console.log(`Chat bot is listenning on port ${PORT}`);
});

const io = socketIo(server);

io.on('connection', (socket) => {
  if (!socket.handshake.query
    || typeof socket.handshake.query !== 'object') {
      socket.disconnect('unauthorized');
    return;
  }

  const { description, latitude, longitude, username } = socket.handshake.query;

  if (typeof socket.handshake.query.username !== 'string') {
    socket.disconnect('unauthorized');
    return;
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    socket.disconnect('unauthorized');
    return;
  }

  if (!users.some((user) => user.username === username)) {
    users.push(new User(description, uuidV4(), latitude, longitude, username, socket));
  }

  socket.emit('bots', botList);
  socket.emit('messages', messages);
  io.emit('users', users.map(({ description, id, username }) => ({ description, id, username })));

  socket.on('message-send', async (messageDTO) => {
    try {
      const { content } = messageDTO;
      const user = users.find((user) => user.username === username);
      if (user) {
        const messageResponse = await CommandParser(content, user);
        if (messageResponse !== null) {
          const messageResponseDTO = {
            ...messageResponse,
            from: username
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
    }
  });

  socket.on('disconnect', () => {
    users = users.filter((user) => user.username !== username);
    io.emit('users', users.map(({ description, id, username }) => ({ description, id, username })));
  });
});
