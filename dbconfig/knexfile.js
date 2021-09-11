// Update with your config settings.

export default {
  
  development: {
    client: 'postgresql',
    connection: {
      host: localhost,
      port: 3008,      
      user:     'postgres',
      password: '112',
      database: 'newbase',
    },
    pool: {
      min: 1,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }, 

};
