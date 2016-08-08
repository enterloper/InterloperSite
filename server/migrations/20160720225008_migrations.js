
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('blogs', function(table){
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
    }),
    knex.schema.createTableIfNotExists('toy_problems', function(table){
      table.increments('id').primary();
      table.text('title');
      table.text('description');
      table.text('difficulty').defaultTo('Beginner');
      table.text('body');
      table.text('url');
      table.boolean('blog_attached').defaultTo(false);
      table.text('image').defaultTo('richardboothe.png');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
    }),
    knex.schema.createTableIfNotExists('projects', function(table){
      table.increments('id').primary();
      table.text('title');
      table.text('description');
      table.boolean('blog_attached').defaultTo(false);
      table.text('image').defaultTo('richardboothe.png');
      table.text('url');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("blogs"),
    knex.schema.dropTableIfExists("toy_problems"),
    knex.schema.dropTableIfExists("projects")
  ]);
};

