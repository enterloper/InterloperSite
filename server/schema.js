'use strict';
var knex = require('./db');

knex.schema.createTableIfNotExists('blogs', function(table) {
  table.increments('id').primary();
  table.text('title');
  table.text('category');
  table.text('description');
  table.text('body');
  table.text('toy_problem_id');
  table.boolean('toy_problem_attached').defaultTo(false);
  table.text('image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('toy_problems', function(table) {
  table.increments('id').primary();
  table.text('title');
  table.text('description');
  table.text('difficulty').defaultTo('Beginner');
  table.text('body');
  table.text('url');
  table.text('blog_id').defaultTo(); 
  table.boolean('blog_attached').defaultTo(false);
  table.text('image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('projects', function(table) {
  table.increments('id').primary();
  table.text('title');
  table.text('description');
  table.boolean('blog_attached').defaultTo(false);
  table.text('image').defaultTo('richardboothe.png');
  table.text('url');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
// .createTableIfNotExists('blogs_to_problems' , function(table) {
//   table.text('');
// })
// .createTableIfNotExists('problems_to_blogs', function(table) {})
.then(function() {
  console.log('Success Applying Schema');
  knex.destroy();
})
.catch(function(err) {
  console.error('[schema.js: 45] - error: ', err.message);
});
