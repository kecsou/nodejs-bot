module.exports = class User {
  constructor(
    connectionId,
    description,
    id,
    latitude,
    longitude,
    username
  ) {
    this.connectionId = connectionId;
    this.description = description;
    this.id = id;
    this.username = username;
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
  }
};
