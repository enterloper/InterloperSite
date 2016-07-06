var config = require('./knexfile.js');
var env = process.env.NODE_ENV || 'development';
var knex = require('knex')(config[env]); 
knex.migrate.latest([config]);  
module.exports = knex;