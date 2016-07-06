var config = require('./knexfile.js');
var env = process.env.NODE_ENV || 'development';
var knex = require('knex')(config[env]); 
knex.migrate.latest([config]);  
module.exports = knex;

var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var _               = require('lodash');
var path            = require('path'); 
var morgan          = require('morgan');
var config          = require('./config/config');
var Post            = require('./posts/posts_model');
var ToyProb         = require('./toy_problems/toy_problems_model');
var db              = require('./db');
var router          = require('./routes/router');
//rootPath for path to client directory => Interloper/client
var rootPath = path.normalize(__dirname + './../client');
//serve static files in client directory, without processing them.
app.use("/pages", express.static(rootPath + '/pages'));
app.use("/style", express.static(rootPath + '/style'));
app.use("/img", express.static(rootPath + '/img'));
app.use("/lib", express.static(rootPath + '/lib'));
app.use("/src", express.static(rootPath + '/src'));
app.use("/routes/router", router);

//middleware
// app.use(morgan('dev'));
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use('/blog/', Post.getAll);
app.use(function(err, req, res, next) {
  if (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

app.get('/', function(req, res) {
    res.sendFile(path.join(rootPath+'/index.html'));
});

app.get('/toyProblems', function(req, res) {
    res.sendFile(path.join(rootPath+'/pages/toyProblems.html'));
});

app.get('/blog', function(req, res) {
  res.sendFile(path.join(rootPath+'/pages/blog.html'));
});

app.get('/portfolio', function(req, res) {
  res.sendFile(path.join(rootPath+'/pages/portfolio.html'));
});

app.listen(config.port || 3000, function(){
  console.log('Listening on port:' , config.port);
});

module.exports=app;  

module.exports = {
  
  development: {
    client: 'pg',
    connection: {
      host    : '127.0.0.1',
      database: 'blogdb'
    },
    migrations: {
      tableName: 'migrations',
      directory: './'
    },
    seeds: {
      directory: './seeds'
    },
    debug: true
  },

  production: {
    client: 'pg',
    connection: {
      database: 'blogdb',
      user:     'richardjboothe',
      password: 'blogdb'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: './',
    },
    seeds: {
      directory: './seeds'
    },
    debug: true
  }
};

'use strict';
var knex = require('./db');

knex.schema.createTableIfNotExists('blogs', function(table){
  table.increments('blog_id').primary();
  table.string('blog_title').unique();
  table.string('blog_category');
  table.text('blog_description');
  table.text('blog_body');
  table.boolean('toy_problem_attached').defaultTo(false);
  table.foreign('toy_problem_id').references('toy_problems_id').defaultTo(null);
})
.createTableIfNotExists('toy_problems', function(table){
  table.increments('toy_problems_id').primary();
  table.string('toy_problem_title').unique();
  table.text('toy_problem_description');
  table.string('toy_problem_difficulty');
  table.text('toy_problem_body');
  table.boolean('blog_attached').defaultTo(false);
  table.foreign('blogs_id').references('blog_id');
})
.createTableIfNotExists('projects', function(table){
  table.increments('project_id').primary();
  table.string('project_title').unique();
  table.text('project_description');
  table.boolean('blog_attached').defaultTo(false);
  table.foreign('blogs_id').references('blog_id');
})
.then(function(res){
  console.log('Success Applying Schema');
  knex.destroy();
})
.catch(function(err){
  console.log('[schema.js: 35] - error: ', err.message);
});

var _ = require('lodash');

var config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: process.env.PORT || 3000
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;
// console.log('NODE_ENV:',process.env.NODE_ENV);
var envConfig;

try {
  envConfig = require('./' + config.env);
  // just making sure the require actually
  // gets something back :)
  envConfig = envConfig || {};
} catch(e) {
  envConfig = {};
}

module.exports = _.merge(config, envConfig);
module.exports = {
  // enabled logging for development
  logging: true,
  seed: true,
  db: blogdb
};
module.exports = {
  // disbable logging for production
  logging: false
};

module.exports = {
  // disbable logging for testing
  logging: false,
  db: {
    // url: 'mongodb://localhost/nodeblog-test'
  }
};

exports.seed = function(knex, Promise) {
  return Promise.join(
    //Delete ALL existing entries
    knex('blogs').del(),
    knex('blogs').insert({
      blog_id: 1,
      blog_title: 'The Stack and the Queue',
      blog_category: 'data_management',
      blog_description: 'This is seed data holder number 1 for blogs from the database',
      blog_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      toy_problem_attached: true
    }),
    knex('blogs').insert({
      blog_id: 2,
      blog_title: 'Building an Api',
      blog_category: 'data_management',
      blog_description: 'This is seed data holder number 2 for blogs from the database',
      blog_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      toy_problem_attached: false
    }),
    knex('blogs').insert({
      blog_id: 3,
      blog_title: 'Using Postgres',
      blog_category: 'data_management',
      blog_description: 'This is seed data holder number 3 for blogs from the database',
      blog_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      toy_problem_attached: false
    })
  );
};



exports.seed = function(knex, Promise) {
  return Promise.join(
    //Delete ALL existing entries
    knex('toy_problems').del(),
    knex('toy_problems').insert({
      toy_problems_id: 1,
      toy_problem_title: 'The Stack and the Queue',
      toy_problem_description: 'This is seed data holder number 1 for Toy Problems from the database',
      toy_problem_difficulty: 'intermediate',
      toy_problem_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      blog_attached: true
    }),
    knex('toy_problems').insert({
      toy_problems_id: 2,
      toy_problem_title: 'String Reverse',
      toy_problem_description: 'This is seed data holder number 2 for Toy Problems from the database',
      toy_problem_difficulty: 'easy',
      toy_problem_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      blog_attached: false
    }),
    knex('toy_problems').insert({
      toy_problems_id: 3,
      toy_problem_title: 'Palindrome',
      toy_problem_description: 'This is seed data holder number 3 for Toy Problems from the database',
      toy_problem_difficulty: 'easy',
      toy_problem_body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      blog_attached: false   
    })
  );
};


var knex = require('./db');
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('blogs', function(table){
      table.increments('blog_id').primary();
      table.string('blog_title').unique();
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
