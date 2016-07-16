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
var Posts           = require('./posts/posts_model');
var ToyProbs        = require('./toy_problems/toy_problems_model');
var Projects        = require('./projects/projects_model');
var db              = require('./db');
var router          = require('./routes/router');
var Handlebars      = require('handlebars');
var handlebars      = require('express-handlebars').create({
                                                            defaultLayout: 'main',
                                                            helpers: {
                                                              section: function(name, options){
                                                                if(!this._sections) this._sections = {};
                                                                this._sections[name] = options.fn(this);
                                                                return null;
                                                              }
                                                            }
                                                          });

Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);
  console.log(this.exphbs)
 
  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});

//rootPath for path to client directory => Interloper/client
var rootPath = path.normalize(__dirname + './../client');
// Set up Handlebars engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//serve static files in client directory, without processing them.
app.use(express.static('client'));
app.use("/pages", express.static(rootPath + '/pages'));
app.use("/style", express.static(rootPath + '/style'));
app.use("/img", express.static(rootPath + '/img'));
app.use("/lib", express.static(rootPath + '/lib'));
app.use("/src", express.static(rootPath + '/src'));
app.use("/routes/router", router);

//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.disable('x-powered-by');
//middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//REQUEST HEADERS CHECK
app.get('/headers', function(req, res) {
  res.set('Content-Type', 'text/plain');
  var s = '';
  req.secure;
  for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

//Site Routing
// app.get('/', function(req, res) {
//     res.sendFile(path.join(rootPath+'/index.html'));
// });
app.get('/', function(req, res){
  res.render('home');
});

/***************** TOY PROBLEM ROUTING *****************/
app.get('/toy-problems', function(req, res) {
  var toy_problems; 
  ToyProbs.getAll()
  .then(function(data) {
    toy_problems = data;
    return toy_problems;
  }).then(function(data) {
      var context = {
        toy_problems: toy_problems.map(function(toy_problem) {
          return {
            id: toy_problem.toy_problem_id,
            title: toy_problem.toy_problem_title,
            description: toy_problem.toy_problem_description
          };
        })
      };
      console.log('{{{{{{CONTEXT1:',context);
      return context;
    }).then(function(value){
      res.render('toyProblems', value);
    });
});

    // console.log('DAAAAAAAAAAATTTTTTAAAAAAA:', data);
// app.get('/toy-problems/:id', function(req, res) {
//   ToyProbs.getToyProbByID(Number(req.params.id))
//   .then(function(data){
//     console.log('DAAAATAAAAA',data);
//   })
// });

app.get('/toy-problems/:title', function(req, res, title) {
  var toy_problem;
  ToyProbs.getToyProbByTitle(req.params.title)
  .then(function(data) {
    toy_problem = data;
    return toy_problem;
  }).then(function(toy_problem) {
    console.log('TOOOOOOY PRRRRRRRROBLEM',toy_problem)
    var context = {
      id: toy_problem[0].toy_problem_id,
      title: toy_problem[0].toy_problem_title,
      description: toy_problem[0].toy_problem_description,
      body: toy_problem[0].toy_problem_body,
      blog_attached: toy_problem[0].blog_attached,
      created_at: toy_problem[0].created_at
    }
    console.log('{{{{{{CONTEXT2:',context);
    return context;
  })
  .then(function(value){
    console.log('valueeeeeeeeeeee:',value);
    res.render('layouts/singleToyProblem', value);
  });
});

/***************** BLOG ROUTING *****************/

app.get('/blog', function(req, res) {
    var posts; 
  Posts.getAll().then(function(data) {
    posts = data;
    }).then(function(data) {
      var context = {
        posts: posts.map(function(post) {
          return {
            id: post.blog_id,
            title: post.blog_title,
            description: post.blog_description,
            image: post.image_source
          };
        })
      };
      return context;
    }).then(function(value){
      res.render('blog', value);
    });
});

app.get('/blog/:title', function(req, res, title) {
  var post;
  Posts.getPostByTitle(req.params.title)
  .then(function(data) {
    post = data;
    return post;
  }).then(function(post) {
    console.log('TOOOOOOY PRRRRRRRROBLEM',post)
    var context = {
      id: post[0].blog_id,
      title: post[0].blog_title,
      description: post[0].blog_description,
      body: post[0].blog_body,
      blog_attached: post[0].toy_problem_attached,
      created_at: post[0].created_at
    }
    console.log('{{{{{{CONTEXT2:',context);
    return context;
  })
  .then(function(value){
    console.log('valueeeeeeeeeeee:',value);
    res.render('singleBlog', value);
  });
});

app.get('/portfolio', function(req, res) {
  var projects; 
  Projects.getAll()
  .then(function(data) {
    projects = data;
  }).then(function(data) {
      var context = {
        projects: projects.map(function(project) {
          return {
            id: project.project_id,
            title: project.project_title,
            description: project.project_description
          };
        })
      };
      return context;
    }).then(function(value){
      res.render('portfolio', value);
    });
});

app.get('/add-content', function(req, res) {
  res.render('additional');
});

/***************** BLOG ENDPOINTS *****************/

app.param('id', function(req, res, next, id) {
  req.params.id = Number(id);
  next();
});

//GET all posts
app.get('/api/posts', function(req, res, next) {
  Posts.getAll()
  .then(function(data) {
    console.log(data);
    res.status(200).json(data);
  }).catch(next);
});

//Add a post
app.post('/api/posts/', function(req, res, next) {
  Posts.addNewBlogPost(req.body)
  .then(function(resp) {
    res.status(201).json(res.req.body);
  }).catch(function(err) {
    console.error(err.stack);
    next();
  });
});


//GET post by ID
app.get('/api/posts/:id', function(req, res, next) {
  Posts.getPostByID(req.params.id)
  .then(function(data){
    res.status(200).json(data);
  }).catch(function(err) {
    console.error(err.stack);
    next();
  });
});

//Edit a post
app.put('/api/posts/:id', function(req, res, next){
  Posts.editBlogPost(req.params.id, req.body)
  .then(function(resp) {
    console.log("Modified on blog number "+req.params.id+":", res.req.body);
    res.status(200).json(res.req.body);
  })
  .catch(function(err){
    console.error(err.stack);
    next();
  });
});

//Delete a post
app.delete('/api/posts/:id', function(req, res, next) {
  Posts.deletePost(req.params.id)
  .then(function(resp) {
    console.log("Deleted blog number "+req.params.id+":", res.req.body);
    res.status(200).json(resp);
  })
  .catch(function(err){
    console.error(err.stack);
    next();
  });
});

//GET post by Title
app.get('/api/posts/title:title', function(req, res, next){
  Posts.getPostByTitle(req.params.title)
  .then(function(data){
    console.log(data);
    res.status(200).json(data);
  }).catch(function(err){
    console.error(err.stack);
    next();
  });
});

//GET post by Category
app.get('/api/posts/category/:category', function(req, res, next) {
  Posts.getPostByCategory(req.params.category)
  .then(function(data) {
    console.log(data);
    res.send(data);
  }).catch(function(err){
    console.error(err.stack);
    next();
  });
});

/************* TOY PROBLEM ENDPOINTS *************/

//GET ALL toy problems
app.get('/api/problems', function(req, res, next) {
  ToyProbs.getAll()
  .then(function(resp) {
    console.log(resp);
    res.send(resp);
  }).catch(function(err){
    console.error(err.stack);
    next();
  });
});

//Add a toy problems
app.post('/api/problems', function(req, res, next) {
  ToyProbs.addNewToyProblem(req.body)
  .then(function(resp) {
    res.status(201).json(res.req.body);
  }).catch(function(err) {
    console.error(err.stack);
    next();
  });
});

//GET a toy problem by ID
app.get('/api/problems/:id', function(req, res, next){
  ToyProbs.getToyProbByID(req.params.id)
  .then(function(data){
    res.send(data);
  }).catch(function(err){
    console.error(err.stack);
    next();
  });
});


//Edit a Toy Problem
app.put('/api/problems/:id', function(req, res, next) {
  console.log(req.params.id);
  ToyProbs.editToyProblem(req.params.id, req.body)
  .then(function(resp) {
    console.log("Modified on toy problem number "+req.params.id+":", res.req.body);
    res.status(200).json(res.req.body);
  })
  .catch(function(err){
    console.error(err.stack);
  });
});

//Delete a post
app.delete('/api/problems/:id', function(req, res, next) {
  ToyProbs.deleteToyProblem(req.params.id)
  .then(function(resp) {
    console.log("Deleted toy problem number "+req.params.id+":", res.req.body);
    res.status(200).json(res.body);
  })
  .catch(function(err){
    console.error(err.stack);
  });
});


//GET toy problem by Title
app.get('/api/problems/title:title', function(req, res, next){
  ToyProbs.getToyProbByTitle(req.params.title)
  .then(function(data){
    console.log(data);
    res.status(200).json(data);
  }).catch(function(err){
    console.error(err.stack);
    next();
  });
});

//GET a toy problem by difficulty level
app.get('/api/problems/difficulty/:level', function(req, res, next) {
  ToyProbs.getToyProbByDifficulty(req.params.level)
  .then(function(data) {
    res.send(data);
  }).catch(function(err){
    console.error(err.stack);
    next();
  });
});

/************* PORTFOLIO ENDPOINTS *************/


//GET all projects
app.get('/api/projects', function(req, res, next) {
  Projects.getAll()
  .then(function(data) {
    console.log(data);
    res.status(200).json(data);
  }).catch(function(err){
    console.error(err.stack);
    next();
  });
});

//Add a post
app.post('/api/projects/', function(req, res, next) {
  Projects.addNewProject(req.body)
  .then(function(resp) {
    res.status(201).json(res.req.body);
  }).catch(function(err) {
    console.error(err.stack);
    next();
  });
});


//GET project by ID
app.get('/api/projects/:id', function(req, res, next){
  Projects.getProjectByID(req.params.id)
  .then(function(data){
    res.status(200).json(data);
  }).catch(function(err) {
    console.error(err.stack);
    next();
  });
});

//Edit a project
app.put('/api/projects/:id', function(req, res, next){
  Projects.editProject(req.params.id, req.body)
  .then(function(resp) {
    console.log("Modified on project number "+req.params.id+":", res.req.body);
    res.status(200).json(res.req.body);
  })
  .catch(function(err){
    console.error(err.stack);
  });
});

//Delete a project
app.delete('/api/projects/:id', function(req, res, next) {
  Projects.deleteProject(req.params.id)
  .then(function(resp) {
    console.log("Deleted project number "+req.params.id+":", res.req.body);
    res.status(200).json(resp);
  })
  .catch(function(err){
    console.error(err.stack);
  });
});

//GET project by Title
app.get('/api/projects/title:title', function(req, res, next){
  Projects.getProjectByTitle(req.params.title)
  .then(function(data){
    console.log(data);
    res.status(200).json(data);
  }).catch(function(err){
    console.error(err.stack);
    next();
  });
});

//ERROR HANDLING FOR RESPONSE CODES OTHER THAN 200
app.get('/error', function(err, req, res, next) {
  //set status to 500 and render error page
  console.error(err.message);
  res.status(500).render('500');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500');
});

app.use(function(req, res) {
  res.status(404).render('404');
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
      tableName:'migrations',
      directory: './migrations'
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
  table.string('blog_title');
  table.string('blog_category');
  table.text('blog_description');
  table.text('blog_body');
  table.boolean('toy_problem_attached').defaultTo(false);
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  table.foreign('toy_problem_id').references('toy_problem_id');
})
.createTableIfNotExists('toy_problems', function(table){
  table.increments('toy_problem_id').primary();
  table.string('toy_problem_title');
  table.text('toy_problem_description');
  table.string('toy_problem_difficulty');
  table.text('toy_problem_body');
  table.boolean('blog_attached').defaultTo(false);
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  table.foreign('blogs_id').references('blog_id');
})
.createTableIfNotExists('projects', function(table){
  table.increments('project_id').primary();
  table.string('project_title');
  table.text('project_description');
  table.boolean('blog_attached').defaultTo(false);
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
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
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      table.foreign('toy_problem_id').references('toy_problem_id');
    }),

    knex.schema.createTableIfNotExists('toy_problems', function(table){
      table.increments('toy_problem_id').primary();
      table.string('toy_problem_title');
      table.text('toy_problem_description');
      table.string('toy_problem_difficulty');
      table.text('toy_problem_body');
      table.boolean('blog_attached').defaultTo(false);
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      table.foreign('blogs_id').references('blog_id');
    }),
    
    knex.schema.createTableIfNotExists('projects', function(table){
      table.increments('project_id').primary();
      table.string('project_title');
      table.text('project_description');
      table.boolean('blog_attached').defaultTo(false);
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      table.foreign('blogs_id').references('blogs_id') ;
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
