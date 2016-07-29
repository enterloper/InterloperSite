
var environment = process.env.NODE_ENV || 'development';
var config      = require('../knexfile.js')[environment];
var knex        = require('knex')(config);
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
var Handlebars      = require('handlebars');
var exphbs          = require('express-handlebars');
var BlogRouter      = require('./routes/blogRouter');
var TPRouter        = require('./routes/TPRouter');
var ProjectsRouter  = require('./routes/ProjectsRouter');
var APIRouter       = require('./routes/APIRouter');
var MainRouter      = require('./routes/mainRouter');
var Promise         = require('bluebird');

// SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = path.resolve(__dirname +'./../public');
app.use( express.static(assetFolder) );

// Set up Handlebars engine
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    static: function(name) {
      return require('./static.js').map(name);
    }
  },
  partialsDir: [
    'server/views/shared/templates',
    'server/views/partials'
  ],
  layoutsDir: 'server/views/layouts'
});

app.set( 'port', (process.env.PORT || 3000) );

//middleware
//assetFolder for path to public directory => Interloper/public
//serve static files in public directory, without processing them.

app.use('/img', express.static(assetFolder + '/img') );
app.use( express.static(assetFolder + '/style') );
app.use( express.static(assetFolder + '/src') );
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(morgan('dev'));

//ROUTERS
app.use("/api", APIRouter);
app.use("/", MainRouter); 
app.use("/toy-problems", TPRouter);
app.use("/blog", BlogRouter);
app.use("/portfolio", ProjectsRouter);
app.use(function(req, res) {
  res.status(404).render('404');
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.set('view cache', true);
app.set('case sensitive routing', false); 

//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.disable('x-powered-by');
app.param('id', function(req, res, next, id) {
  req.params.id = Number(id);
  next();
});

//ERROR HANDLING FOR RESPONSE CODES OTHER THAN 200
app.get('/error', function(err, req, res, next) {
  //set status to 500 and render error page
  // console.error(err.message);
  res.status(500).render('500');
});

app.use(function(err, req, res, next) {
    // console.error(err.stack);
    res.status(500).render('500');
});

app.listen(app.get('port'), function(){
  console.log('Node app is running on port:' , app.get('port'));
});

module.exports = app;  





'use strict';
var knex = require('./db');

knex.schema.createTableIfNotExists('blogs', function(table){
  table.increments('blog_id').primary();
  table.string('blog_title');
  table.string('blog_category');
  table.text('blog_description');
  table.text('blog_body');
  table.boolean('toy_problem_attached').defaultTo(false);
  table.string('blog_image');
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
  table.string('toy_problem_image');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  table.foreign('blogs_id').references('blog_id');
})
.createTableIfNotExists('projects', function(table){
  table.increments('project_id').primary();
  table.string('project_title');
  table.text('project_description');
  table.boolean('blog_attached').defaultTo(false);
  table.string('project_image');
  table.string('project_url');
  table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  table.foreign('blogs_id').references('blog_id');
})
.then(function(res){
  // console.log('Success Applying Schema');
  knex.destroy();
})
.catch(function(err){
  // console.log('[schema.js: 35] - error: ', err.message);
});

var baseUrl = '';

exports.map = function(name){
  return baseUrl+name;
};
var _ = require('lodash');

var config = {
  dev: 'development',
  test: 'testing',
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
  seed: true,
  db: blogdb
};
module.exports = {
  // disbable logging for production
  logging: false,
  seed: true
};

module.exports = {
  // disbable logging for testing
  logging: false,
  db: blogdb
};


exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('blogs', function(table){
      table.increments('blog_id').primary();
      table.string('blog_title');
      table.string('blog_category');
      table.text('blog_description');
      table.text('blog_body');
      table.boolean('toy_problem_attached').defaultTo(false);
      table.string('blog_image');
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
      table.string('toy_problem_image');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      table.foreign('blogs_id').references('blog_id');
    }),
    knex.schema.createTableIfNotExists('projects', function(table){
      table.increments('project_id').primary();
      table.string('project_title');
      table.text('project_description');
      table.boolean('blog_attached').defaultTo(false);
      table.string('project_image');
      table.string('project_url');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      table.foreign('blogs_id').references('blog_id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("blogs"),
    knex.schema.dropTable("toy_problems"),
    knex.schema.dropTable("projects")
  ]);
};


var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var Posts = module.exports;

  Posts.getAll = function() {
    return db('blogs')
    .orderBy('blog_id', 'desc');
  };

  Posts.getPostByID = function(id) {
    return db('blogs')
    .where({
      'blog_id' : id
    });
  };

  Posts.getPostByTitle = function(title) {
    return db('blogs')
    .where({
      'blog_title' : title
    });
  };

  Posts.getPostByCategory = function(category) {
    return db('blogs')
    .where({
      'blog_category' : category
    });
  };

  Posts.addNewBlogPost = function(data) {
    return db('blogs')
    .insert(data);
  };

  Posts.editBlogPost = function(id, data) {
    return db('blogs')
    .where({
      'blog_id': id
    })
    .limit(1)
    .update(data)
    .then(function(data) {
      // console.log(data);
      return data;
    })
    .catch(function(err){
      // console.error(err.stack);
    });
  };

//DELETE A POST
  Posts.deletePost = function(id){ 
    return db('blogs')
    .where({
      'blog_id': id
    })
    .del()
    .then(function(data) {
      // console.log('Deleted '+data+' blog post.');
    }).catch(function(error) {
      // console.error(error);
    });
  };

  /*
  <-----------TODO: SET UP NEXT AND PREVIOUS QUERIES FOR BUTTONS--------------->
  SELECT
    DISTINCT i.id AS id,
    i.userid AS userid,
    i.itemname AS itemname,
    COALESCE(LEAD(i.id)        OVER (ORDER BY i.created DESC)
            ,FIRST_VALUE(i.id) OVER (ORDER BY i.created DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)) AS nextitemid,
    COALESCE(LAG(i.id)         OVER (ORDER BY i.created DESC)
            ,LAST_VALUE(i.id)  OVER (ORDER BY i.created DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)) AS previtemid,
    COALESCE(LEAD(i.id)        OVER (PARTITION BY i.userid ORDER BY i.created DESC)
            ,FIRST_VALUE(i.id) OVER (PARTITION BY i.userid ORDER BY i.created DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)) AS nextuseritemid,
    COALESCE(LAG(i.id)         OVER (PARTITION BY i.userid ORDER BY i.created DESC)
            ,LAST_VALUE(i.id)  OVER (PARTITION BY i.userid ORDER BY i.created DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)) AS prevuseritemid,
    i.created AS created
  FROM items i
    LEFT JOIN users u
    ON i.userid = u.id
  ORDER BY i.created DESC;
  
  Posts.getPreviousPost = function() {
    console.log(db('blogs'));
    return db('blogs')
    .where({ })
  };

  Posts.getNextPost = function() {
    console.log(db('blogs'));
    return db('blogs')
    .where({ })
  }
  */


/************* BLOG TODO ENDPOINTS *************/
// Get bound toyproblems if present

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


var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var Projects = module.exports;


Projects.getAll = function() {
  return db('projects')
  .orderBy('project_id', 'desc');
};


Projects.getProjectByID = function(id) {
  return db('projects')
  .where({
    'project_id' : id
  });
};

Projects.getProjectByTitle = function(ProjectTitle) {
  return db('projects')
  .where({
    'project_title' : ProjectTitle
  });
};

Projects.addNewProject = function(data) {
  return db('projects')
  .insert(data);
};

Projects.editProject = function(id, data) {
  return db('projects')
  .where({
    'project_id' : id
  })
  .limit(1)
  .update(data)
  .then(function(data) {
    // console.log(data);
    return data;
  })
  .catch(function(err){
    // console.error(err.stack)
  });
};

Projects.deleteProject = function(id) {
  return db('projects')
  .where({
    project_id: id
  })
  .del()
  .then(function(data) {
    // console.log('Deleted '+data+' blog post.')
  });
};
/************* TODO ENDPOINTS *************/
// Get bound blog if present
// create mods/push/put



var express    = require('express');
var APIRouter = express.Router();
var Posts      = require('./../posts/posts_model');
var Projects   = require('./../projects/projects_model');
var ToyProbs   = require('./../toy_problems/toy_problems_model');
var path       = require('path');
var Promise    = require('bluebird');

//SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = path.resolve(__dirname + './../../public');
APIRouter.use( express.static(assetFolder) );

/***************** API ROUTING *****************/

APIRouter.get('/add-content', function(req, res) {
    res.render('additional');
  });

/***************** API HEADER CHECK *****************/
APIRouter.get('/headers', function(req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    req.secure;
    for(var name in req.headers) {s += name + ': ' + req.headers[name] + '\n';}
    res.send(s);
  });

/***************** BLOG ENDPOINTS *****************/
//GET all posts
APIRouter.route('/posts') 
  .get(function(req, res) {
    Posts.getAll()
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  })
//Add a post
  .post(function(req, res) {
    Posts.addNewBlogPost(req.body)
    .then(function(resp) {
      res.status(201).json(res.req.body);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  });

//GET post by ID
APIRouter.route('/posts/:id')
    .get(function(req, res) {
      Posts.getPostByID(req.params.id)
      .then(function(data){
        res.status(200).json(data);
      }).catch(function(err) {
        // console.error(err.stack);
      });
    })
  //Edit a post
    .put(function(req, res, next){
      Posts.editBlogPost(req.params.id, req.body)
      .then(function(resp) {
        // console.log("Modified on blog number "+req.params.id+":", res.req.body);
        res.status(200).json(res.req.body);
      })
      .catch(
        // console.error(err.stack);
        next
      );
    })
  //Delete a post
    .delete(function(req, res, next) {
      Posts.deletePost(req.params.id)
      .then(function(resp) {
        // console.log("Deleted blog number "+req.params.id+":", res.req.body);
        res.status(200).json(resp);
      })
      .catch(
        // console.error(err.stack);
        next
      );
    });

//GET post by Title
APIRouter.get('/posts/title/:title', function(req, res, next){
    Posts.getPostByTitle(req.params.title)
    .then(function(data){
      res.status(200).json(data);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  });

//GET post by Category
APIRouter.get('/posts/category/:category', function(req, res, next) {
    Posts.getPostByCategory(req.params.category)
    .then(function(data) {
      res.send(data);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  });

/************* TOY PROBLEM ENDPOINTS *************/
//GET ALL toy problems
APIRouter.route('/problems') 
    .get(function(req, res, next) {
      ToyProbs.getAll()
      .then(function(resp) {
        res.send(resp);
      })
      .catch(
        // console.error(err.stack);
        next
      );
    })
    //Add a toy problems
    .post(function(req, res, next) {
      ToyProbs.addNewToyProblem(req.body)
      .then(function(resp) {
        res.status(201).json(res.req.body);
      })
      .catch(
        // console.error(err.stack);
        next
      );
    });

//GET a toy problem by ID
APIRouter.route('/problems/:id') 
    .get(function(req, res, next){
      ToyProbs.getToyProbByID(req.params.id)
      .then(function(data){
        res.send(data);
      })
      .catch(
        // console.error(err.stack);
        next
      );
    })
    //Edit a Toy Problem
    .put(function(req, res, next) {
      ToyProbs.editToyProblem(req.params.id, req.body)
      .then(function(resp) {
        // console.log("Modified on toy problem number "+req.params.id+":", res.req.body);
        res.status(200).json(res.req.body);
      })
      .catch(function(err){
        // console.error(err.stack);
      });
    })
    //Delete a post
    .delete(function(req, res, next) {
      ToyProbs.deleteToyProblem(req.params.id)
      .then(function(resp) {
        // console.log("Deleted toy problem number "+req.params.id+":", res.req.body);
        res.status(200).json(res.body);
      })
      .catch(
        // console.error(err.stack);
        next
      );
    });

//GET toy problem by Title
APIRouter.get('/problems/title/:title', function(req, res, next){
    ToyProbs.getToyProbByTitle(req.params.title)
    .then(function(data){
      res.status(200).json(data);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  });

//GET a toy problem by difficulty level
APIRouter.get('/problems/difficulty/:level', function(req, res, next) {
    ToyProbs.getToyProbByDifficulty(req.params.level)
    .then(function(data) {
      res.send(data);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  });

/************* PORTFOLIO ENDPOINTS *************/
//GET all projectsAPIRouter.route('/projects') 
APIRouter.route('/projects') 
  .get(function(req, res, next) {
    Projects.getAll()
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  })
  //Add a post
  .post(function(req, res, next) {
    Projects.addNewProject(req.body)
    .then(function(resp) {
      res.status(201).json(res.req.body);
    })
    .catch(      // console.error(err.stack);
      next
    );
  });


//GET project by ID
APIRouter.route('/projects/:id')
  .get(function(req, res, next){
    Projects.getProjectByID(req.params.id)
    .then(function(data){
      res.status(200).json(data);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  })
  //Edit a project
  .put(function(req, res, next){
    Projects.editProject(req.params.id, req.body)
    .then(function(resp) {
      // console.log("Modified on project number "+req.params.id+":", res.req.body);
      res.status(200).json(res.req.body);
    })
    .catch(function(err){
      // console.error(err.stack);
    });
  })
  //Delete a project
  .delete(function(req, res, next) {
    Projects.deleteProject(req.params.id)
    .then(function(resp) {
      // console.log("Deleted project number "+req.params.id+":", res.req.body);
      res.status(200).json(resp);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  });

//GET project by Title
APIRouter.get('/projects/title/:title', function(req, res, next){
    Projects.getProjectByTitle(req.params.title)
    .then(function(data){
      res.status(200).json(data);
    })
    .catch(
      // console.error(err.stack);
      next
    );
  });

module.exports = APIRouter;


var express           = require('express');
var ProjectsRouter    = express.Router();
var Projects          = require('./../projects/projects_model');
var path              = require('path');

// SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = path.resolve(__dirname + './../../public');
ProjectsRouter.use( express.static(assetFolder) );

/***************** PORTFOLIO ROUTING *****************/

ProjectsRouter.get('/', function(req, res, next) {
    var projects; 
    Projects.getAll()
    .then(function(data) {
      projects = data;
    })
    .then(function(data) {
      var context = {
        projects: projects.map(function(project) {
          return {
            id: project.project_id,
            title: project.project_title,
            description: project.project_description,
            image: project.project_image,
            url: project.project_url
          };
        })
      };
      return context;
    })
    .then(function(value){
        res.render('portfolio', value);
      });
  });

module.exports = ProjectsRouter;

var express  = require('express');
var TPRouter = express.Router();
var ToyProbs = require('./../toy_problems/toy_problems_model');
var path     = require('path');
var Promise  = require('bluebird');

//SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = path.resolve(__dirname + './../../public');
TPRouter.use( express.static(assetFolder) );

/***************** TOY PROBLEM ROUTING *****************/
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
              id: toy_problem.toy_problem_id,
              title: toy_problem.toy_problem_title,
              description: toy_problem.toy_problem_description,
              image: toy_problem.toy_problem_description
            };
          })
        };
        return context;
      })
    .then(function(value){
        res.render('toyProblems', value);
      })
    .catch(
      // console.error(err.stack);
      next
    );
  });

TPRouter.get('/:title', function(req, res, next) {
    var toy_problem;
    ToyProbs.getToyProbByTitle(req.params.title)
    .then(function(data) {
      toy_problem = data;
      return toy_problem;
    })
    .then(function(toy_problem) {
      var context = {
        id: toy_problem[0].toy_problem_id,
        title: toy_problem[0].toy_problem_title,
        description: toy_problem[0].toy_problem_description,
        body: toy_problem[0].toy_problem_body,
        blog_attached: toy_problem[0].blog_attached,
        image: toy_problem[0].toy_problem_image,
        created_at: toy_problem[0].created_at
      };
      return context;
    })
    .then(function(value){
      res.render('singleToyProblem', value);
    })
    .catch(
      // console.error(err);
      next
    );
  });

module.exports = TPRouter;


var express    = require('express');
var BlogRouter = express.Router();
var Posts      = require('./../posts/posts_model');
var path       = require('path');
var Promise    = require('bluebird');

//SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = path.resolve(__dirname + './../../public');
BlogRouter.use( express.static(assetFolder) );

/***************** BLOG ROUTING *****************/

BlogRouter.get('/', function(req, res, next) {
    var posts; 
    Posts.getAll()
    .then(function(data) {
      posts = data;
      return posts; 
    })
    .then(function(data) {
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
      })
    .then(function(value){
        res.render('blog', value);
      })
    .catch(
      // console.error(err.stack);
      next
    );
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
        id: post[0].blog_id,
        title: post[0].blog_title,
        description: post[0].blog_description,
        body: post[0].blog_body,
        blog_attached: post[0].toy_problem_attached,
        image: post[0].blog_image,
        created_at: post[0].created_at
      };
      return context;
    })
    .then(function(value){
      res.render('singleBlog', value);
    })
    .catch(
      // console.error(err);
      next
    );
  });

module.exports = BlogRouter;



var express     = require('express');
var MainRouter  = express.Router();
var Path        = require('path');

// //SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = Path.resolve(__dirname + './../../public');
MainRouter.use( express.static(assetFolder) );

/***************** HOME PAGE ROUTING *****************/
MainRouter.get('/', function(req, res){
  res.render('home');
});

module.exports = MainRouter;
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


var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var ToyProbs = module.exports;


ToyProbs.getAll = function() {
  return db('toy_problems')
  .orderBy('toy_problem_id', 'desc');
};


ToyProbs.getToyProbByID = function(id) {
  return db('toy_problems')
  .where({
    'toy_problem_id' : id
  });
};

ToyProbs.getToyProbByTitle = function(title) {
  return db('toy_problems')
  .where({
    'toy_problem_title' : title
  });
};

ToyProbs.getToyProbByDifficulty = function(level) {
  return db('toy_problems')
  .where({
    'toy_problem_difficulty' : level
  });
};

ToyProbs.addNewToyProblem = function(data) {
  return db('toy_problems')
  .insert(data);
};

ToyProbs.editToyProblem = function(id, data) {
  return db('toy_problems')
  .where({
    'toy_problem_id': id
  })
  .limit(1)
  .update(data)
  .then(function(data) {
    // console.log(data);
    return data;
  })
  .catch(function(err){
    // console.error(err.stack);
  });
};

//DELETE A TOY PROBLEM
ToyProbs.deleteToyProblem = function(id) {
  return db('toy_problems')
  .where({
    'toy_problem_id': id
  })
  .del()
  .then(function(data) {
    // console.log('Deleted '+data+' blog post.');
  });
};
/************* TODO ENDPOINTS *************/
// Get bound blog if present
// Get next and previous toy problem