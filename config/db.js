const dotenv = require('dotenv');
const configFunction = require('./configFunction');

dotenv.config();

let connection;

if (
  process.env.DB_HOST
  && process.env.DB_PORT
  && process.env.DB_USER
  && process.env.DB_PASS
  && process.env.DB_NAME
) {
  // Use environment variables if they are defined.
  connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  };
} else {
  // Use default values if environment variables are not defined.
  connection = {
    host: 'manny.db.elephantsql.com',
    port: '5432',
    user: 'usftjyce',
    password: 'rFaRvxw2rPAARDLqVtW9H2hzFSbZEWYv',
    database: 'usftjyce',
  };
}
const db = configFunction(connection);

module.exports = { db };
