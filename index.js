const express = require('express');
const socketIo = require('socket.io');
const app = express();

const PORT = 8080;
//const rooms = [];
//const users = [];
const users = new Map();

app.get('/users', (_, res) => {
  res.send(users);
});

app.post('/users', (req, res) => {
  const username = req.body.username;
  const user = {
    username,
    socket: null
  };
  users.push(user);
  res.end();
});

const server = app.listen(PORT, () => {
  console.log(`Chat bot is listenning on port ${PORT}`);
});
const io = socketIo(server);

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.username) {
    const username = socket.handshake.query.username;
    users.set(username, {
      socket
    });

    next();
  } else {
    next(new Error('Username should be provided'));
  }
});

io.on('connection', (socket) => {
  socket.on('message-send', (msg) => {
    console.log(socket.id);
    socket.emit('message-received', 'Hello');
  });

  socket.on('disconnect', () => {
    const [ username ] = Array.from(users.entries())
      .find(([ key, value ]) => {
        value.socket === socket;
      });
    users.delete(username);
  });
});