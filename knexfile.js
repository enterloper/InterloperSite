console.log("host",process.env.POSTGRES_HOST);
console.log("port",process.env.POSTGRES_PORT);
console.log("user", process.env.POSTGRES_USER);
console.log("password", process.env.POSTGRES_PASSWORD);
console.log("database" ,process.env.POSTGRES_DB);
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
      directory: './seeds'
    },
    debug: true
  },
  production: {
    client: 'pg',
    connection: {
      charset: 'utf8',
      host : process.env.POSTGRES_HOST,
      port : process.env.POSTGRES_PORT,
      user : process.env.POSTGRES_USER,
      password : process.env.POSTGRES_PASSWORD,
      database : process.env.POSTGRES_DB,
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
      directory: './seeds'
    },
    debug: true
  }
};
    // connection: {
    //   host : 'ec2-54-243-126-40.compute-1.amazonaws.com',
    //   port: 5432,
    //   database: 'BLOG_DB',
    //   user:     'richardjboothe',
    //   password: 'BLOG_DB'
    // },