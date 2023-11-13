const knex  = require('knex');
const dotenv = require('dotenv');

dotenv.config();

dbConfig = {
    client: 'pg',
    connection: {
        host: process.env.USER_HOST,
        port: process.env.USER_PORT,
        user: process.env.USER_USER,
        password: process.env.USER_PASS,
        database: process.env.USER_NAME,
      },
};
console.log(dbConfig);

const userDB = knex(dbConfig);

module.exports = { userDB };