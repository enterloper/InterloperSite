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
      host : 'ec2-54-243-126-40.compute-1.amazonaws.com',
      port: 5432,
      database: 'BLOG_DB',
      user:     'richardjboothe',
      password: 'BLOG_DB'
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
