const ENV = process.env.NODE_ENV;
const HOST = process.env.HOST;
const APP_PORT = process.env.PORT || 3000;
const APP_HOST = `${HOST}:${APP_PORT}`;
const API_URL = process.env.API_URL;

module.exports = {
  ENV,
  APP_PORT,
  APP_HOST,
  API_URL,
};
