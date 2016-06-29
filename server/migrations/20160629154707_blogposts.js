
exports.up = function(knex, Promise) {
 
  return Promise.all([
    knex.schema.createTableIfNotExists('blogs', function(table){
      table.increments('blog_id').primary();
      table.string('blog_title').unique();
      table.string('blog_category');
      table.text('blog_description');
      table.text('blog_body');
    })

    .createTableIfNotExists('toy_problems', function(table){
      table.increments('toy_problems_id').primary();
      table.string('toy_problem_title');
      table.string('toy_problem_difficulty');
      table.boolean('blog_attached');
      // table.foreign('affiliated_blog').references('id').inTable('blogs')
      table.text('toy_problem_description');
      table.text('toy_problem_body');
    })
    .createTableIfNotExists('projects', function(table){
      table.increments('project_id').primary();
      table.string('project_title');
      table.text('project_description');
      table.boolean('blog_attached');
      // table.integer('affiliated_blog').references('id').inTable('blogs')
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('blogs'),
    knex.schema.dropTable('toy_problems'),
  ]); 
};

