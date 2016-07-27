var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile.js')[environment];
knex.migrate.latest([config]);
module.exports = require('knex')(config);