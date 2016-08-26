
module.exports = {
  
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      database: 'blogdb'
    },
    seeds: {
      directory: './server/seeds'
    },
    debug: true
  },
  
  production: {
    client: 'pg',
    connection: {
      host: 'ec2-54-243-126-40.compute-1.amazonaws.com',
      port: 5432,
      user: 'qjiwhevwfexkza',
      password: 'DyKIG3C7CNg-ZhW3qKuFU7zWTt',
      database: 'd3ntj3cmv66vll',
    }
  }
};