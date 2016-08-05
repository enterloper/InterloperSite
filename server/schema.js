'use strict';
var knex = require('./db');

knex.schema.createTableIfNotExists('blogs', function(table) {
  table.increments('blog_id').primary();
  table.string('blog_title');
  table.string('blog_category');
  table.text('blog_description');
  table.text('blog_body');
  table.text('toy_problem_id');
  table.boolean('toy_problem_attached').defaultTo(false);
  table.string('blog_image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('toy_problems', function(table) {
  table.increments('toy_problem_id').primary();
  table.string('toy_problem_title');
  table.text('toy_problem_description');
  table.string('toy_problem_difficulty');
  table.text('toy_problem_body');
  table.text('blog_id'); 
  table.boolean('blog_attached').defaultTo(false);
  table.string('toy_problem_image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('projects', function(table) {
  table.increments('project_id').primary();
  table.string('project_title');
  table.text('project_description');
  table.boolean('blog_attached').defaultTo(false);
  table.string('project_image').defaultTo('richardboothe.png');
  table.string('project_url');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
// .createTableIfNotExists('blogs_to_problems' , function(table) {
//   table.string('');
// })
// .createTableIfNotExists('problems_to_blogs', function(table) {})
.then(function() {
  console.log('Success Applying Schema');
  // return knex.destroy;
})
.catch(function(err) {
  console.error('[schema.js: 45] - error: ', err.message);
});
