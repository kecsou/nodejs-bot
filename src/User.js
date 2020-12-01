module.exports = class User {
  constructor(description, id, latitude, longitude, username, socket) {
    this.description = description;
    this.id = id;
    this.username = username;
    this.socket = socket;
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
  }
};
