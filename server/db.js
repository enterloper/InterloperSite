var env = process.env.NODE_ENV || 'development';
var config = require('./knexfile')[env];
var knex = require('knex')(config); 
knex.migrate.latest([config]);  
module.exports = knex;
