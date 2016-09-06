$(document).ready(function () {
  $('.home_image').hover(function () {
      $(this).stop().animate({opacity: .2}, 700);
      $(this).siblings('.foto_text').removeClass('hide').animate({opacity:1}, 2000);
  }, function () {
      $(this).stop().animate({ opacity: 1}, 900);
      $('.foto_text').addClass('hide');
  });
});
var environment = process.env.NODE_ENV || 'development';
var config      = require('./knexfile.js')[environment];
var knex        = require('knex')(config);
module.exports = knex;
var register = function(Handlebars) {

    var helpers = {
        // put all of your helpers inside this object
        static: function(name) {
          return require('./static.js').map(name);
        },
        debug: function(optionalValue) {
          console.log("Current Context");
          console.log("====================");
          console.log(this);
         
          if (optionalValue) {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
          }
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

// client
if (typeof window !== "undefined") {
    register(Handlebars);
}
// server
else {
    module.exports.register = register;
    module.exports.helpers = register(null);
}

var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var Promise         = require('bluebird');
var morgan          = require('morgan');
var config          = require('./config/config');
var exphbs          = require('express-handlebars');
var APIRouter       = require('./routes/APIRouter.js');
var BlogRouter      = require('./routes/blogRouter.js');
var TPRouter        = require('./routes/TPRouter.js');
var ProjectsRouter  = require('./routes/ProjectsRouter.js');
var path            = require('path');

//for production put in NODE_ENV=production node index.js
// Set up Handlebars engine
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: require('./helpers.js').helpers,
  partialsDir: path.join(__dirname + '/views/partials/'),
  layoutsDir: path.join(__dirname + '/views/layouts/')
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.enable('view cache');
app.disable('x-powered-by');
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('case sensitive routing', false); 

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev',{
  // only log error responses 
  skip: function (req, res) { return res.statusCode < 400; }
}));
// SERVE UP THOSE DELICIOUS STATIC FILES!
app.use( express.static(__dirname + '/../public') );

//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.param('id', function(req, res, next, id) {
  req.params.id = Number(id);
  next();
});

//ROUTERS
app.use("/api", APIRouter);
app.use("/toy-problems", TPRouter);
app.use("/blog", BlogRouter);
app.use("/portfolio", ProjectsRouter);

//HOME PAGE ROUTING
app.get('/', function(req, res){
  res.render('home');
});

//RESUME PAGE ROUTING
app.get('/resume', function(req, res) {
  res.render('resume');
});

//ERROR HANDLING FOR RESPONSE CODES OTHER THAN 200
app.use(function(err, req, res, next) {
    console.log('Error : ' + err.message);
    next();
});

app.use(function(req, res) {
  res.type('text/html');
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  //set status to 500 and render error page
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


//ESTABLISH CONNECTION WITH LISTEN
app.set( 'port', (process.env.PORT || 8000) );
app.listen(app.get('port'), function(){
  console.log('Interloper Site built with Node/Express/Handlebars/jQuery is running on port:' , app.get('port'));
});

module.exports = app;  






module.exports = {
  
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      database: 'blogdb'
    },
    seeds: {
      directory: './server/seeds'
    },
    debug: true
  },
  
  production: {
    client: 'pg',
    connection: {
      host: 'ec2-54-243-50-185.compute-1.amazonaws.com',
      database: 'd3n5fug4v6ma91',
      user: 'ayjjsarvjcjdkp',
      port: 5432,
      password: 'MMfNru6VCecq27poEMN1Le97-k',
      url: 'postgres://ayjjsarvjcjdkp:MMfNru6VCecq27poEMN1Le97-k@ec2-54-243-50-185.compute-1.amazonaws.com:5432/d3n5fug4v6ma91'
    }
  }
};
'use strict';
var knex = require('./db');

knex.schema.createTableIfNotExists('blogs', function(table) {
  table.increments('id').primary();
  table.string('title');
  table.string('category');
  table.text('description');
  table.text('body');
  table.boolean('toy_problem_attached').defaultTo(false);
  table.string('image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('toy_problems', function(table) {
  table.increments('id').primary();
  table.string('title');
  table.string('difficulty').defaultTo('Beginner');
  table.text('description');
  table.text('body');
  table.string('url');
  table.boolean('blog_attached').defaultTo(false);
  table.string('image').defaultTo('richardboothe.png');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.createTableIfNotExists('projects', function(table) {
  table.increments('id').primary();
  table.string('title');
  table.text('description');
  table.boolean('blog_attached').defaultTo(false);
  table.string('image').defaultTo('richardboothe.png');
  table.string('url');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
})
.then(function() {
  console.log('Success Applying Schema');
  knex.destroy();
})
.catch(function(err) {
  console.error('[schema.js: 47] - error: ', err.message);  
});

var baseUrl = '';

exports.map = function(name){
  return baseUrl+name;
};
var _ = require('lodash');

var config = {
  dev: 'development',
  prod: 'production',
  port: process.env.PORT || 3000
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;
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
  seed: true
};
module.exports = {
  // enable logging for production, CHANGE ONCE RUNNING SMOOTHLY
  logging: true,
  seed: false
};

var knex = require('./../db.js');
var _ = require('lodash');
var Promise = require('bluebird');
var Posts = module.exports;

/*************** GET ALL BLOGS ***************/
Posts.getAll = function() {
  return knex("blogs")
  .orderBy('id', 'desc');
};

/*************** GET SINGLE BLOG POST ***************/
Posts.getPostByID = function(id) {
  return knex("blogs")
  .where({
    'id' : id
  });
};

/*************** GET POST BY TITLE ***************/
Posts.getPostByTitle = function(title) {
  return knex("blogs")
  .where({
    'title' : title
  });
};

/*************** GET POST BY CATEGORY ***************/
Posts.getPostByCategory = function(category) {
  return knex("blogs")
  .where({
    'category' : category
  });
};

/*************** ADD POST  ***************/
Posts.addNewBlogPost = function(data) {
  return knex("blogs").insert(data);
};

/*************** EDIT POST ***************/

Posts.editBlogPost = function(id, data) {
  return knex("blogs")
  .where({'id': id})
  .limit(1)
  .update(data)
  .then(function(data) {
    console.log(data);
    return data;
  })
  .catch(function(err){
    console.error(err.stack);
  });
};

/*************** DELETE A POST ***************/

Posts.deletePost = function(id){ 
  return knex("blogs")
  .where({
    'id': id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post containing: '); 
  }).catch(function(error) {
    console.error(error);
  });
};

/*************** GET BOUND TOY PROBLEM ***************/
Posts.getToyProblemMatches = function() {
  return knex
  .table('toy_problems')
  .select('toy_problems.title', 'toy_problems.description')
  .join('blogs', 'toy_problems.title', '=', 'blogs.title');
};
  /*
  <-----------TODO: SET UP NEXT AND PREVIOUS QUERIES FOR BUTTONS--------------->
  Posts.getPreviousPost = function() {
    console.log(knex("blogs"));
    return knex("blogs")
    .where({ })
  };

  Posts.getNextPost = function() {
    console.log(knex("blogs"));
    return knex("blogs")
    .where({ //id = id -1 OR 1 })
  }
  */
// min.min(column) 
// Gets the minimum value for the specified column.
// knex('users').min('age')

// Outputs:
// select min("age") from "users"
// knex('users').min('age as a')

// Outputs:
// select min("age") as "a" from "users"
// max.max(column) 
// Gets the maximum value for the specified column.

// knex('users').max('age')


// Outputs:
// select max("age") from "users"
// knex('users').max('age as a')


// Outputs:
// select max("age") as "a" from "users"


var knex = require('./../db.js');
var _ = require('lodash');
var Promise = require('bluebird');
var Projects = module.exports;

//GET ALL PROJECTS
Projects.getAll = function() {
  return knex('projects')
  .orderBy('id', 'desc');
};

//GET PROJECT BY ID
Projects.getProjectByID = function(id) {
  return knex('projects')
  .where({
    'id' : id
  });
};

//GET PROJECT BY TITLE
Projects.getProjectByTitle = function(ProjectTitle) {
  return knex('projects')
  .where({
    'title' : ProjectTitle
  });
};

//ADD A PROJECT
Projects.addNewProject = function(data) {
  return knex('projects')
  .insert(data);
};

//EDIT A PROJECT
Projects.editProject = function(id, data) {
  return knex('projects')
  .where({
    'id' : id
  })
  .limit(1)
  .update(data)
  .then(function(data) {
    console.log(data);
    return data;
  })
  .catch(function(err){
    console.error(err.stack);
  });
};

//DELETE A PROJECT
Projects.deleteProject = function(id) {
  return knex('projects')
  .where({
    id: id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post.');
  });
};

//GET BOUND BLOG
Projects.getBlogMatches = function() {
  return knex
  .table('projects')
  .select('projects.title', 'projects.description')
  .join('blogs', 'projects.title', '=', 'blogs.title');
};

/************* TODO ENDPOINTS *************/
// create mods/push/put



var express    = require('express');
var APIRouter  = express.Router();
var Promise    = require('bluebird');
var Posts      = require('./../posts/posts_model');
var Projects   = require('./../projects/projects_model');
var ToyProbs   = require('./../toy_problems/toy_problems_model');

/***************** API ROUTING *****************/

/***************** ADD CONTENT *****************/

APIRouter.get('/add-content', function(req, res) {
    res.render('additional');
  });

/***************** API HEADER CHECK *****************/

APIRouter.get('/headers', function(req, res) {
  res.set('Content-Type', 'application/json');
  var s = '';
  req.secure;
  for(var name in req.headers) {s += name + ': ' + req.headers[name] + '\n';}
  res.send(s);
});

/***************** BLOG ENDPOINTS *****************/

/***************** GET/POST BLOG INFORMATION *****************/
APIRouter.route('/posts')
  .get( function(req, res) {
    Posts.getAll()
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err){
      console.error(err.stack);
    });
  })
  .post( function(req, res) {
    console.log("-------------------->POSTreqbody", req.body);
    Posts.addNewBlogPost(req.body)
    .then( function(resp) {
      res.status(201).json(res.req.body);
    })
    .catch(function(err){
      console.error(err.stack);
    });
  });

/***************** GET/PUT/DELETE SINGLE BLOG BY ID *****************/
APIRouter.route('/posts/:id')
  .get( function(req, res) {
      Posts.getPostByID(req.params.id)
      .then(function(data) {
        res.status(200).json(data);
      })
      .catch(function(err) {
        console.error(err.stack);
      });
  })
  .put( function(req, res, next) {
      Posts.editBlogPost(req.params.id, req.body)
      .then(function(resp) {
        console.log("Modified on blog number "+req.params.id+":", res.req.body);
        res.status(200).json(res.req.body);
      })
      .catch(function(err) {
        console.error(err.stack);
        next();
      });
  }).delete( function(req, res, next) {
      Posts.deletePost(req.params.id)
      .then(function(resp) {
        console.log("Deleted blog number "+req.params.id+":", res.req.body);
        res.status(200).json(resp);
      })
      .catch(function(err) {
        console.error(err.stack);
        next();
      });
});

/***************** GET BLOG INFO BY TITLE *****************/
APIRouter.get('/posts/title/:title', function(req, res, next) {
  Posts.getPostByTitle(req.params.title)
  .then(function(data) {
    res.status(200).json(data);
  })
  .catch(function(err) {
    console.error(err.stack);
    next();
  });
});

/***************** GET BLOG INFO BY CATEGORY *****************/
APIRouter.get('/posts/category/:category', function(req, res, next) {
  Posts.getPostByCategory(req.params.category)
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.error(err.stack);
    next();
  });
});

/************* TOY PROBLEM ENDPOINTS *************/

/***************** GET/POST TP INFO *****************/

APIRouter.route('/problems') 
  .get(function(req, res, next) {
    ToyProbs.getAll()
    .then(function(resp) {
      res.send(resp);
    })
    .catch(function(err) {
      console.error(err.stack);
      next();
    });
  })
  .post(function(req, res, next) {
    ToyProbs.addNewToyProblem(req.body)
    .then(function(resp) {
      res.status(201).json(res.req.body);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
     });
});

/***************** GET/PUT/DELETE SINGLE TP INFO BY ID *****************/
APIRouter.route('/problems/:id') 
  .get(function(req, res, next){
    ToyProbs.getToyProbByID(req.params.id)
    .then(function(data){
      res.send(data);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  })
  .put(function(req, res, next) {
    ToyProbs.editToyProblem(req.params.id, req.body)
    .then(function(resp) {
      console.log("Modified on toy problem number "+req.params.id+":", res.req.body);
      res.status(200).json(res.req.body);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  })
  .delete(function(req, res, next) {
    ToyProbs.deleteToyProblem(req.params.id)
    .then(function(resp) {
      console.log("Deleted toy problem number "+req.params.id+":", res.req.body);
      res.status(200).json(res.body);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  });

/***************** GET TP INFO BY TITLE *****************/
APIRouter.get('/problems/title/:title', function(req, res, next){
  ToyProbs.getToyProbByTitle(req.params.title)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    console.error(err.stack);
    next();
  });
});

/***************** GET ALL TP INFO BY DIFFICULTY *****************/
APIRouter.get('/problems/difficulty/:level', function(req, res, next) {
  ToyProbs.getToyProbByDifficulty(req.params.level)
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err){
    console.error(err.stack);
    next();
  });
});

/************* PORTFOLIO ENDPOINTS *************/

/***************** GET/POST PROJECT INFO *****************/
APIRouter.route('/projects') 
  .get(function(req, res, next) {
    Projects.getAll()
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  })
  .post(function(req, res, next) {
    Projects.addNewProject(req.body)
    .then(function(resp) {  
      res.status(201).json(res.req.body);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
});


/***************** GET/PUT/DELETE PROJECT INFO BY ID *****************/
APIRouter.route('/projects/:id') 
  .get(function(req, res, next){
    Projects.getProjectByID(req.params.id)
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err) {
      console.error(err.stack);
      next();
    });
  })
  .put(function(req, res, next){
    Projects.editProject(req.params.id, req.body)
    .then(function(resp) {
      console.log("Modified on project number "+req.params.id+":", res.req.body);
      res.status(200).json(res.req.body);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  })
  .delete(function(req, res, next) {
    Projects.deleteProject(req.params.id)
    .then(function(resp) {
      console.log("Deleted project number "+req.params.id+":", res.req.body);
      res.status(200).json(resp);
    })
    .catch(function(err) {
      console.error(err.stack);
      next();
    });
  });

/***************** GET PROJECT INFO BY TITLE *****************/
APIRouter.get('/projects/title/:title', function(req, res, next) {
  Projects.getProjectByTitle( req.params.title )
  .then(function(data) {
    res.status(200).json(data);
  })
  .catch(function(err) {
    console.error(err.stack);
    next();
  });
});

module.exports = APIRouter;


var express           = require('express');
var ProjectsRouter    = express.Router();
var Projects          = require('./../projects/projects_model');

/***************** PORTFOLIO ROUTING *****************/

/***************** GET ALL PROJECTS *****************/

ProjectsRouter.get('/', function(req, res, next) {
    var projects; 
    Projects.getAll()
    .then( function(data) {
      projects = data;
      return projects;
    })
    .then(function(projects) {
      var context = {
        projects: projects.map(function(project) {
          return {
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.image,
            url: project.url
          };
        })
      };
      return context;
    })
    .then(function(context){
      res.render('portfolio', context);
    })
    .catch( function(err){
      console.error(err.stack);
      next();
    });
  });

module.exports = ProjectsRouter;

var express  = require('express');
var TPRouter = express.Router();
var ToyProbs = require('./../toy_problems/toy_problems_model');
var Promise  = require('bluebird');

/***************** TOY PROBLEM ROUTING *****************/
  ToyProbs.getBlogMatches()
  .then(function(data){
    console.log(data);
  });
/***************** GET ALL TOY PROBLEMS *****************/

TPRouter.get('/', function(req, res, next) {
  var toy_problems; 
  ToyProbs.getAll()
  .then(function(data) {
    toy_problems = data;
    return toy_problems;
  })
  .then(function(data) {
    var context = {
      toy_problems: toy_problems.map(function(toy_problem) {
        return {
          id: toy_problem.id,
          title: toy_problem.title,
          description: toy_problem.description,
          image: toy_problem.image
        };
      })
    };
    return context;
  })
  .then(function(value){
      res.render('toyProblems', value);
  })
  .catch( function(err){
    console.error(err.stack);
    next();
  });
});

/***************** GET TOY PROBLEM BY TITLE *****************/

TPRouter.get('/:title', function(req, res, next) {
  var toy_problem;
  ToyProbs.getBlogMatches()
  .then(function(data){
    console.log(data);
  });
  ToyProbs.getToyProbByTitle(req.params.title)
  .then(function(data) {
    toy_problem = data;
    return toy_problem;
  })
  .then(function(toy_problem) {
    console.log('TOYPROBLEMS IN TITLE', toy_problem);
    var context = {
      id: toy_problem[0].id,
      title: toy_problem[0].title,
      description: toy_problem[0].description,
      body: toy_problem[0].body,
      blog_attached: toy_problem[0].blog_attached,
      image: toy_problem[0].image,
      created_at: toy_problem[0].created_at
    };
    return context;
  })
  .then(function(value){
    res.render('singleToyProblem', value);
  })
  .catch(function(err){
    console.error(err);
    next();
  });
});
/***************** GET TOY PROBLEM BY ID *****************/

TPRouter.get('/id/:id', function(req, res, next) {
  var toy_problem;
  ToyProbs.getToyProbByID(req.params.id)
  .then(function(data) {
    toy_problem = data;
    return toy_problem;
  })
  .then(function(toy_problem) {
    console.log('TOYPROBLEMS IN ID', toy_problem);
    var context = {
      id: toy_problem[0].id,
      title: toy_problem[0].title,
      description: toy_problem[0].description,
      body: toy_problem[0].body,
      blog_attached: toy_problem[0].blog_attached,
      image: toy_problem[0].image,
      created_at: toy_problem[0].created_at
    };
    return context;
  })
  .then(function(value){
    res.render('singleToyProblem', value);
  })
  .catch(function(err){
    console.error(err);
    next();
  });
});

module.exports = TPRouter;


var express    = require('express');
var BlogRouter = express.Router();
var Posts      = require('./../posts/posts_model');
var Promise    = require('bluebird');

/***************** BLOG ROUTING *****************/

/***************** GET ALL BLOGS *****************/

BlogRouter.get('/', function(req, res, next) {
  var posts; 
  Posts.getAll()
  .then(function(data) {
    console.log(data);
    posts = data;
    return posts; 
  })
  .then(function(data) {
    var context = {
      posts: posts.map(function(post) {
        return {
          id: post.id,
          title: post.title,
          description: post.description,
          image: post.image
        };
      })
    };
    return context;
  })
  .then(function(value){
    res.render('blog', value);
  })
  .catch(function(err){
    console.error(err.stack);
    next();
  });
});

BlogRouter.get('/:title', function(req, res, next) {
  var post;
  Posts.getPostByTitle(req.params.title)
  .then(function(data) {
    post = data;
    return post;
  })
  .then(function(post) {
    var context = {
      id: post[0].id,
      title: post[0].title,
      description: post[0].description,
      body: post[0].body,
      image: post[0].image,
      created_at: post[0].created_at
    };
    return context;
  })
  .then(function(value){
    res.render('singleBlog', value);
  })
  .catch(function(err){
    console.error(err);
    next();
  });
});

module.exports = BlogRouter;



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

exports.seed = function(knex, Promise) {
  return Promise.join(
    //Delete ALL existing entries
    knex('toy_problems').del(),
    knex('toy_problems').insert({
      title: 'The Stack and the Queue',
      description: 'This is seed data holder number 1 for Toy Problems from the database',
      difficulty: 'intermediate',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image:'richardboothe.png',
      blog_attached: true
    }),
    knex('toy_problems').insert({
      title: 'String Reverse',
      description: 'This is seed data holder number 2 for Toy Problems from the database',
      difficulty: 'easy',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image:'richardboothe.png',
      blog_attached: false
    }),
    knex('toy_problems').insert({
      title: 'Palindrome',
      description: 'This is seed data holder number 3 for Toy Problems from the database',
      difficulty: 'easy',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image:'richardboothe.png',
      blog_attached: false   
    })
  );
};


var knex = require('./../db.js');
var _ = require('lodash');
var Promise = require('bluebird');
var ToyProbs = module.exports;

/*************** GET ALL TOY PROBLEMS ***************/
ToyProbs.getAll = function() {
  return knex('toy_problems')
  .orderBy('id', 'desc');
  };

/*************** GET TOY PROBLEM BY ID ***************/
ToyProbs.getToyProbByID = function(id) {
  return knex('toy_problems')
  .where({
    'id' : id
  });
};

/*************** GET TOY PROBLEM BY TITLE***************/
ToyProbs.getToyProbByTitle = function(title) {
  return knex('toy_problems')
  .where({
    'title' : title
  });
};

/*************** GET TOY PROBLEMS BY DIFFICULTY ***************/
ToyProbs.getToyProbByDifficulty = function(level) {
  return knex('toy_problems')
  .where({
    'difficulty' : level
  });
};

/*************** ADD A SINGLE TOY PROBLEM ***************/
ToyProbs.addNewToyProblem = function(data) {
  return knex('toy_problems')
  .insert(data);
};

/*************** EDIT SINGLE TOY PROBLEM ***************/
ToyProbs.editToyProblem = function(id, data) {
  return knex('toy_problems')
  .where({
    'id': id
  })
  .limit(1)
  .update(data)
  .then(function(data) {
    console.log(data);
    return data;
  })
  .catch(function(err){
    console.error(err.stack);
  });
};

/*************** DELETE A TOY PROBLEM ***************/
ToyProbs.deleteToyProblem = function(id) {
  return knex('toy_problems')
  .where({
    'id': id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post.');
  });
};

/*************** GET BOUND BLOG ***************/
ToyProbs.getBlogMatches = function() {
  return knex
  .table('blogs')
  .select('blogs.title', 'blogs.description')
  .join('toy_problems', 'blogs.title', '=', 'toy_problems.title');
};
/************* TODO ENDPOINTS *************/
// Get next and previous toy problem