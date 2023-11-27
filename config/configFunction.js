const knex = require('knex');

function configFunction(connection) {
  const config = {
    client: 'pg',
    connection,
  };

  return knex(config);
}

module.exports = configFunction;
