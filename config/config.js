require('dotenv').config();

exports.env = {
  PORT: process.env.PORT || 3001,
  DB_URL: process.env.DB_URL,
  DB_NAME: process.env.DB_NAME,
  API_LINK: process.env.API_LINK,
  API_USERS: process.env.API_USERS,
};
