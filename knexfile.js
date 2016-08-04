
module.exports = {
  
  development: {
    client: 'pg',
    connection: {
      charset: 'utf8',
      host    : '127.0.0.1',
      database: 'blogdb'
    },
    migrations: {
      tableName:'migrations',
      directory: 'server/migrations'
    },
    seeds: {
      directory: './server/seeds'
    },
    debug: true
  },
  
  production: {
    client: 'pg',
    connection: {
      host : 'ec2-54-243-126-40.compute-1.amazonaws.com',
      database : 'd3ntj3cmv66vll',
      user : 'qjiwhevwfexkza',
      port : 5432,
      password : 'DyKIG3C7CNg-ZhW3qKuFU7zWTt',
      ssl: true
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: '_migrations',
      directory: 'server/migrations',
    },
    seeds: {
      directory: './server/seeds'
    },
    debug: true
  }
};