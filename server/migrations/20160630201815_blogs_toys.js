var knex = require('./../db');

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('blogs', function(table){
      table.increments('blog_id').primary();
      table.string('blog_title');
      table.string('blog_category');
      table.text('blog_description');
      table.text('blog_body');
      table.boolean('toy_problem_attached').defaultTo(false);
      table.foreign('toy_problem_id').references('toy_problems_id');
    }),

    knex.schema.createTableIfNotExists('toy_problems', function(table){
      table.increments('toy_problems_id').primary();
      table.string('toy_problem_title');
      table.text('toy_problem_description');
      table.string('toy_problem_difficulty');
      table.text('toy_problem_body');
      table.boolean('blog_attached').defaultTo(false);
      table.foreign('blogs_id').references('blog_id');
    }),
    
    knex.schema.createTableIfNotExists('projects', function(table){
      table.increments('project_id').primary();
      table.string('project_title');
      table.text('project_description');
      table.boolean('blog_attached').defaultTo(false);
      table.foreign('blogs_id').references('blog_id') ;
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('blogs'),
    knex.schema.dropTable('toy_problems'),
    knex.schema.dropTable('projects')
  ]);
};