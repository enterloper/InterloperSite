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
var exphbs  = require('express-handlebars');

//if debugging, use {{debug}} at the top of the view
Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);
  console.log(this.exphbs);
 
  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});

//rootPath for path to public directory => Interloper/public
var rootPath = path.normalize(__dirname + './../public');

// Set up Handlebars engine
app.engine('handlebars', exphbs({defaultLayout: 'main',
                                 partialsDir: [
                                  "views/partials/" 
                                 ]
                               }));
app.set('view engine', 'handlebars');
app.enable('view cache');

//serve static files in public directory, without processing them.
app.use(express.static('public'));
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
      return context;
    }).then(function(value){
      res.render('toyProblems', value);
    });
});

app.get('/toy-problems/:title', function(req, res, title) {
  var toy_problem;
  ToyProbs.getToyProbByTitle(req.params.title)
  .then(function(data) {
    toy_problem = data;
    return toy_problem;
  }).then(function(toy_problem) {
    var context = {
      id: toy_problem[0].toy_problem_id,
      title: toy_problem[0].toy_problem_title,
      description: toy_problem[0].toy_problem_description,
      body: toy_problem[0].toy_problem_body,
      blog_attached: toy_problem[0].blog_attached,
      created_at: toy_problem[0].created_at
    }
    return context;
  })
  .then(function(value){
    res.render('singleToyProblem', value);
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
    var context = {
      id: post[0].blog_id,
      title: post[0].blog_title,
      description: post[0].blog_description,
      body: post[0].blog_body,
      blog_attached: post[0].toy_problem_attached,
      created_at: post[0].created_at
    }
    return context;
  })
  .then(function(value){
    res.render('singleBlog', value);
  });
});

/***************** PORTFOLIO ROUTING *****************/

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

/***************** API HEADER CHECK *****************/
app.get('/api/headers', function(req, res) {
  res.set('Content-Type', 'text/plain');
  var s = '';
  req.secure;
  for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    console.log('THIS IS s::::::::',s);
    res.send(s);
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




