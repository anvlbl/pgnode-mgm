// Update with your config settings.
import dbconfig from "./dbconfig.js";

export default {
  
  development: {
    client: 'pg',
    connection: dbconfig,
    pool: {
      min: 1,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }, 

};
