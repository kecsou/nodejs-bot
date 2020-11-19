module.exports = class User {
  constructor(id, position, username, socket) {
    this.id = id;
    this.position = position;
    this.username = username;
    this.socket = socket;
  }
};
