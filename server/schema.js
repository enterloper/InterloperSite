'use strict';
var knex = require('./db');

knex.schema.createTableIfNotExists('blogs', function(table) {
  table.increments('id').primary();
  table.string('title');
  table.text('category');
  table.text('description');
  table.text('body');
  table.boolean('toy_problem_attached').defaultTo(false);
  table.text('image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('toy_problems', function(table) {
  table.increments('id').primary();
  table.string('title');
  table.text('description');
  table.text('difficulty').defaultTo('Beginner');
  table.text('body');
  table.text('url');
  table.boolean('blog_attached').defaultTo(false);
  table.text('image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('projects', function(table) {
  table.increments('id').primary();
  table.string('title');
  table.text('description');
  table.boolean('blog_attached').defaultTo(false);
  table.text('image').defaultTo('richardboothe.png');
  table.text('url');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
// .createTableIfNotExists('blog_toyprob', function(table){
//   table.integer('blog_id').notNullable().references('id').inTable('blogs').onDelete('CASCADE');
//   table.integer('toy_problem_id').notNullable().references('id').inTable('toy_problems').onDelete('CASCADE');
//   table.primary(['blog_id', 'toy_problem_id']);
// })
.then(function() {
  console.log('Success Applying Schema');
  knex.destroy();
})
.catch(function(err) {
  console.error('[schema.js: 47] - error: ', err.message);  
});
