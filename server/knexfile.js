// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host    : '127.0.0.1',
      database: 'blogdb'
    },
    migrations: {
      tableName: 'migrations',
      directory: './'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'blogdb',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: './'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'blogdb',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: './'
    }
  }

};
