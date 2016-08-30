
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
      host: 'ec2-54-243-50-185.compute-1.amazonaws.com',
      database: 'd3n5fug4v6ma91',
      user: 'ayjjsarvjcjdkp',
      port: 5432,
      password: 'MMfNru6VCecq27poEMN1Le97-k',
      url: 'postgres://ayjjsarvjcjdkp:MMfNru6VCecq27poEMN1Le97-k@ec2-54-243-50-185.compute-1.amazonaws.com:5432/d3n5fug4v6ma91'
    }
  }
};