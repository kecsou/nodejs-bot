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
const User = require('./User');
const { getUserBySocket } = require('./utils');

const app = express();

const PORT = process.env.port || 8080;

const bots = [{
  id: uuidV4(),
  from: 'youtube',
}];

const users = new Map();

/**
 * @type {Message[]}
 */
const messages = [];

app.use(express.static(resolve(`${__dirname}public`)));

const server = app.listen(PORT, () => {
  console.log(`Chat bot is listenning on port ${PORT}`);
});

const io = socketIo(server);

io.use((socket, next) => {
  if (!socket.handshake.query
    || typeof socket.handshake.query !== 'object') {
    next(new Error('No query provided'));
    return;
  }

  if (typeof socket.handshake.query.username !== 'string') {
    next(new Error('Username should be provided'));
    return;
  }

  if (typeof socket.handshake.query.position !== 'object') {
    next(new Error('No position provided'));
    return;
  }

  if (typeof socket.handshake.query.position.latitude !== 'number') {
    next(new Error('The latitude should be a number'));
    return;
  }

  if (typeof socket.handshake.query.position.longitude !== 'number') {
    next(new Error('The longitude should be a number'));
    return;
  }

  const { position, username } = socket.handshake.query;
  users.set(username, new User(uuidV4(), position, username, socket));
  next();
});

io.on('connection', (socket) => {
  socket.emit('users', users.entries()
    .map((kv) => kv[0])
  );
  socket.emit('bots', bots);

  socket.on('message-send', async (messageDTO) => {
    const { content } = messageDTO;
    const user = getUserBySocket(socket, users);
    if (user) {
      const messageResponse = await CommandParser(content, user);
      if (messageResponse) {
        messages.push(messageResponse);
      }
    }
    io.emit('message', messageDTO);
  });

  socket.on('disconnect', () => {
    const { username } = getUserBySocket(socket, users);
    users.delete(username);
  });
});
