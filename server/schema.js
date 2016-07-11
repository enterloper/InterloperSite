'use strict';
var knex = require('./db');

knex.schema.createTableIfNotExists('blogs', function(table){
  table.increments('blog_id').primary();
  table.string('blog_title');
  table.string('blog_category');
  table.text('blog_description');
  table.text('blog_body');
  table.boolean('toy_problem_attached').defaultTo(false);
  table.timestamps();
  table.foreign('toy_problem_id').references('toy_problem_id');
})
.createTableIfNotExists('toy_problems', function(table){
  table.increments('toy_problem_id').primary();
  table.string('toy_problem_title');
  table.text('toy_problem_description');
  table.string('toy_problem_difficulty');
  table.text('toy_problem_body');
  table.boolean('blog_attached').defaultTo(false);
  table.timestamps();
  table.foreign('blogs_id').references('blog_id');
})
.createTableIfNotExists('projects', function(table){
  table.increments('project_id').primary();
  table.string('project_title');
  table.text('project_description');
  table.boolean('blog_attached').defaultTo(false);
  table.timestamps();
  table.foreign('blogs_id').references('blog_id');
})
.then(function(res){
  console.log('Success Applying Schema');
  knex.destroy();
})
.catch(function(err){
  console.log('[schema.js: 35] - error: ', err.message);
});
