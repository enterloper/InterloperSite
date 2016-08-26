'use strict';
var knex = require('./db');

knex.schema.createTableIfNotExists('blogs', function(table) {
  table.increments('id').primary();
  table.string('title');
  table.string('category');
  table.text('description');
  table.text('body');
  table.boolean('toy_problem_attached').defaultTo(false);
  table.string('image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('toy_problems', function(table) {
  table.increments('id').primary();
  table.string('title');
  table.string('difficulty').defaultTo('Beginner');
  table.text('description');
  table.text('body');
  table.string('url');
  table.boolean('blog_attached').defaultTo(false);
  table.string('image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('projects', function(table) {
  table.increments('id').primary();
  table.string('title');
  table.text('description');
  table.boolean('blog_attached').defaultTo(false);
  table.string('image').defaultTo('richardboothe.png');
  table.string('url');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.then(function() {
  console.log('Success Applying Schema');
  knex.destroy();
})
.catch(function(err) {
  console.error('[schema.js: 47] - error: ', err.message);  
});
