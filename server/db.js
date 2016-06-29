var config = require('./knexfile');
var env = process.env.NODE_ENV || 'development';
  var knex = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: 'knex,public'
  });
var knex = require('knex')(config[env]);
module.exports = knex;