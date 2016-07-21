module.exports = {
  
  development: {
    client: 'pg',
    connection: {
      host    : '127.0.0.1',
      database: 'blogdb'
    },
    migrations: {
      tableName:'migrations',
      directory: 'server/migrations'
    },
    seeds: {
      directory: './seeds'
    },
    debug: true
  },

  production: {
    client: 'pg',
    connection: {
      database: 'blogdb',
      user:     'richardjboothe',
      password: 'blogdb'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: 'server/migrations',
    },
    seeds: {
      directory: './seeds'
    },
    debug: true
  }
};
