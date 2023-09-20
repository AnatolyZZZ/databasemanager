import knex  from 'knex';
import dotenv from 'dotenv';

dotenv.config();

export const db = knex({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST || 'manny.db.elephantsql.com',
      port : process.env.DB_PORT || 5432,
      user : process.env.DB_USER || 'usftjyce',
      password : process.env.DB_PASS || 'rFaRvxw2rPAARDLqVtW9H2hzFSbZEWYv',
      database : process.env.DB_NAME || 'usftjyce'
    }
  })