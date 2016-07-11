exports.seed = function(knex, Promise) {
  return Promise.join(
    //Delete ALL existing entries
    knex('toy_problems').del(),
    knex('toy_problems').insert({
      toy_problem_id: 1,
      toy_problem_title: 'The Stack and the Queue',
      toy_problem_description: 'This is seed data holder number 1 for Toy Problems from the database',
      toy_problem_difficulty: 'intermediate',
      toy_problem_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      blog_attached: true
    }),
    knex('toy_problems').insert({
      toy_problem_id: 2,
      toy_problem_title: 'String Reverse',
      toy_problem_description: 'This is seed data holder number 2 for Toy Problems from the database',
      toy_problem_difficulty: 'easy',
      toy_problem_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      blog_attached: false
    }),
    knex('toy_problems').insert({
      toy_problem_id: 3,
      toy_problem_title: 'Palindrome',
      toy_problem_description: 'This is seed data holder number 3 for Toy Problems from the database',
      toy_problem_difficulty: 'easy',
      toy_problem_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      blog_attached: false   
    })
  );
};

