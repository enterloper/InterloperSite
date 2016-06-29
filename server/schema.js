'use strict';
//If a table or column needs to be added, you may put it in schema_todo.txt
let knex = require('./db');

knex.schema.createTableIfNotExists('blogs', function(table){
  table.increments('blog_id').primary();
  table.string('blog_title').unique();
  table.string('blog_category');
  table.string('blog_description');
  table.string('blog_body');
})

.createTableIfNotExists('toy_problems', function(table){
  table.increments('toy_problems_id').primary();
  table.string('toy_problem_title');
  table.string('toy_problem_difficulty');
  table.boolean('blog_attached');
  // table.foreign('affiliated_blog').references('id').inTable('blogs')
  table.string('toy_problem_description');
  table.string('toy_problem_body');
})
.createTableIfNotExists('projects', function(table){
  table.increments('project_id').primary();
  table.string('project_title');
  table.string('project_description');
  table.boolean('blog_attached');
  // table.integer('affiliated_blog').references('id').inTable('blogs')
})
.then(function(res){
  console.log('Success Applying Schema');
  knex.destroy();
})
.catch(function(err){
  console.log('[schema.js: 34] - error: ', err.message);
});
