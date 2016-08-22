
module.exports = {
  
  development: {
    client: 'pg',
    connection: {
    charset: 'utf8',
    host: '127.0.0.1',
    port: 5432,
    database: 'blogdb'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName:'migrations',
      directory: 'server/migrations'
    },
    seeds: {
      directory: './server/seeds'
    },
    // debug: true
  },
  
  production: {
    client: 'pg',
    connection: {
      charset: 'utf8',
      host: 'ec2-54-243-126-40.compute-1.amazonaws.com',
      port: 5432,
      user: 'qjiwhevwfexkza',
      password: 'DyKIG3C7CNg-ZhW3qKuFU7zWTt',
      database: 'd3ntj3cmv66vll',
      ssl: true
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
      directory: './server/seeds'
    },
    // debug: true
  }
};