module.exports = class User {
  constructor(description, id, username, socket) {
    this.description = description;
    this.id = id;
    this.username = username;
    this.socket = socket;
  }
};
