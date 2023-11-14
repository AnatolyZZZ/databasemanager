const configFunction  = require('./configFunction');
const dotenv = require('dotenv');

dotenv.config();

const connection = {
  host: process.env.CLIENTS_HOST,
  port: process.env.CLIENTS_PORT,
  user: process.env.CLIENTS_USER,
  password: process.env.CLIENTS_PASS,
  database: process.env.CLIENTS_NAME,
}


const clientDB = configFunction(connection);

module.exports = { clientDB };