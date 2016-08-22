exports.seed = function(knex, Promise) {
  return Promise.join(
    //DELETE ALL EXISTING ENTRIES
    knex('blogs').del(),
    //CREATE SEEDS
    knex('blogs').insert({
      title: 'The Stack and the Queue',
      category: 'data_management',
      description: 'This is seed data holder number 1 for blogs from the database',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image:'richardboothe.png',
      toy_problem_attached: true
    }),
    knex('blogs').insert({
      title: 'Building an Api',
      category: 'data_management',
      description: 'This is seed data holder number 2 for blogs from the database',
      body: 'Lorem ipsum dolor <h1>sit</h1> amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image:'richardboothe.png',
      toy_problem_attached: false
    }),
    knex('blogs').insert({
      title: 'Using Postgres',
      category: 'data_management',
      description: 'This is seed data holder number 3 for blogs from the database',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image:'richardboothe.png',
      toy_problem_attached: false
    })
  );
};
// SELECT MAX(the_primary_key) FROM the_table; 
// SELECT nextval('the_primary_key_sequence'); 
// SELECT setval('the_primary_key_sequence', (SELECT MAX(the_primary_key) FROM the_table)+1);
