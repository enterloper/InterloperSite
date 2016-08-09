exports.seed = function(knex, Promise) {
  return Promise.join(
    //Delete ALL existing entries
    knex('toy_problems').del(),
    knex('toy_problems').insert({
      id: 1,
      title: 'The Stack and the Queue',
      description: 'This is seed data holder number 1 for Toy Problems from the database',
      difficulty: 'intermediate',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image:'richardboothe.png',
      blog_attached: true
    }),
    knex('toy_problems').insert({
      id: 2,
      title: 'String Reverse',
      description: 'This is seed data holder number 2 for Toy Problems from the database',
      difficulty: 'easy',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image:'richardboothe.png',
      blog_attached: false
    }),
    knex('toy_problems').insert({
      id: 3,
      title: 'Palindrome',
      description: 'This is seed data holder number 3 for Toy Problems from the database',
      difficulty: 'easy',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image:'richardboothe.png',
      blog_attached: false   
    })
  );
};

