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

//assetFolder for path to public directory => Interloper/public
var assetFolder = path.resolve(__dirname, './../../public');
app.use( express.static(assetFolder) );
app.use('/img', express.static(assetFolder + '/img') );
app.use('/style', express.static(assetFolder + '/style') );

//serve static files in public directory, without processing them.
app.use(express.static('public'));
//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.disable('x-powered-by');
//middleware
// app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');


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
    'server/views/partials/'
  ],
  layoutsDir: 'server/views/layouts/'
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.enable('view cache');
app.set('view cache', true);

app.param('id', function(req, res, next, id) {
  req.params.id = Number(id);

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

//ROUTERS
app.use("/toy-problems", TPRouter);
app.use("/blog", BlogRouter);
app.use("/portfolio", ProjectsRouter);
app.use("/api", APIRouter);
app.use("/", MainRouter); 
app.use(function(req, res) {
  res.status(404).render('404');
});

app.get('/api/add-content', function(req, res) {
    res.render('additional');
});

/***************** API HEADER CHECK *****************/
app.get('/api/headers', function(req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    req.secure;
    for(var name in req.headers) {s += name + ': ' + req.headers[name] + '\n';}
    res.send(s);
  });

/***************** BLOG ENDPOINTS *****************/
//GET all posts
// app.route('/api/posts') 
//   .get(function(req, res) {
//     Posts.getAll()
//     .then(function(data) {
//       res.status(200).json(data);
//     })
//     .catch(function(err){
//       console.error(err.stack);
//       next();
//     });
//   })
// //Add a post
//   .post(function(req, res) {
//     Posts.addNewBlogPost(req.body)
//     .then(function(resp) {
//       res.status(201).json(res.req.body);
//     })
//     .catch(function(err) {
//       console.error(err.stack);
//     });
//   });

// //GET post by ID
// app.route('/api/posts/:id')
//     .get(function(req, res) {
//       Posts.getPostByID(req.params.id)
//       .then(function(data){
//         res.status(200).json(data);
//       }).catch(function(err) {
//         console.error(err.stack);
//       });
//     })
//   //Edit a post
//     .put(function(req, res, next){
//       Posts.editBlogPost(req.params.id, req.body)
//       .then(function(resp) {
//         console.log("Modified on blog number "+req.params.id+":", res.req.body);
//         res.status(200).json(res.req.body);
//       })
//       .catch(function(err){
//         console.error(err.stack);
//         next();
//       });
//     })
//   //Delete a post
//     .delete(function(req, res, next) {
//       Posts.deletePost(req.params.id)
//       .then(function(resp) {
//         console.log("Deleted blog number "+req.params.id+":", res.req.body);
//         res.status(200).json(resp);
//       })
//       .catch(function(err){
//         console.error(err.stack);
//         next();
//       });
//     });

// //GET post by Title
// app.get('/api/posts/title/:title', function(req, res, next){
//     Posts.getPostByTitle(req.params.title)
//     .then(function(data){
//       res.status(200).json(data);
//     })
//     .catch(function(err){
//       console.error(err.stack);
//       next();
//     });
//   });

// //GET post by Category
// app.get('/api/posts/category/:category', function(req, res, next) {
//     Posts.getPostByCategory(req.params.category)
//     .then(function(data) {
//       res.send(data);
//     })
//     .catch(function(err){
//       console.error(err.stack);
//       next();
//     });
//   });

// /************* TOY PROBLEM ENDPOINTS *************/
// //GET ALL toy problems
// app.route('/api/problems') 
//     .get(function(req, res, next) {
//       ToyProbs.getAll()
//       .then(function(resp) {
//         res.send(resp);
//       })
//       .catch(function(err){
//         console.error(err.stack);
//         next();
//       });
//     })
//     //Add a toy problems
//     .post(function(req, res, next) {
//       ToyProbs.addNewToyProblem(req.body)
//       .then(function(resp) {
//         res.status(201).json(res.req.body);
//       })
//       .catch(function(err) {
//         console.error(err.stack);
//         next();
//       });
//     });

// //GET a toy problem by ID
// app.route('/api/problems/:id') 
//     .get(function(req, res, next){
//       ToyProbs.getToyProbByID(req.params.id)
//       .then(function(data){
//         res.send(data);
//       })
//       .catch(function(err){
//         console.error(err.stack);
//         next();
//       });
//     })
//     //Edit a Toy Problem
//     .put(function(req, res, next) {
//       ToyProbs.editToyProblem(req.params.id, req.body)
//       .then(function(resp) {
//         console.log("Modified on toy problem number "+req.params.id+":", res.req.body);
//         res.status(200).json(res.req.body);
//       })
//       .catch(function(err){
//         console.error(err.stack);
//       });
//     })
//     //Delete a post
//     .delete(function(req, res, next) {
//       ToyProbs.deleteToyProblem(req.params.id)
//       .then(function(resp) {
//         console.log("Deleted toy problem number "+req.params.id+":", res.req.body);
//         res.status(200).json(res.body);
//       })
//       .catch(function(err){
//         console.error(err.stack);
//       });
//     });

// //GET toy problem by Title
// app.get('/api/problems/title/:title', function(req, res, next){
//     ToyProbs.getToyProbByTitle(req.params.title)
//     .then(function(data){
//       res.status(200).json(data);
//     })
//     .catch(function(err){
//       console.error(err.stack);
//       next();
//     });
//   });

// //GET a toy problem by difficulty level
// app.get('/api/problems/difficulty/:level', function(req, res, next) {
//     ToyProbs.getToyProbByDifficulty(req.params.level)
//     .then(function(data) {
//       res.send(data);
//     })
//     .catch(function(err){
//       console.error(err.stack);
//       next();
//     });
//   });

// /************* PORTFOLIO ENDPOINTS *************/
// //GET all projectsapp.route('/projects') 
// app.route('/api/projects') 
//   .get(function(req, res, next) {
//     Projects.getAll()
//     .then(function(data) {
//       res.status(200).json(data);
//     })
//     .catch(function(err){
//       console.error(err.stack);
//       next();
//     });
//   })
//   //Add a post
//   .post(function(req, res, next) {
//     Projects.addNewProject(req.body)
//     .then(function(resp) {
//       res.status(201).json(res.req.body);
//     })
//     .catch(function(err) {
//       console.error(err.stack);
//       next();
//     });
//   });


// //GET project by ID
// app.route('/api/projects/:id')
//   .get(function(req, res, next){
//     Projects.getProjectByID(req.params.id)
//     .then(function(data){
//       res.status(200).json(data);
//     })
//     .catch(function(err) {
//       console.error(err.stack);
//       next();
//     });
//   })
//   //Edit a project
//   .put(function(req, res, next){
//     Projects.editProject(req.params.id, req.body)
//     .then(function(resp) {
//       console.log("Modified on project number "+req.params.id+":", res.req.body);
//       res.status(200).json(res.req.body);
//     })
//     .catch(function(err){
//       console.error(err.stack);
//     });
//   })
//   //Delete a project
//   .delete(function(req, res, next) {
//     Projects.deleteProject(req.params.id)
//     .then(function(resp) {
//       console.log("Deleted project number "+req.params.id+":", res.req.body);
//       res.status(200).json(resp);
//     })
//     .catch(function(err){
//       console.error(err.stack);
//     });
//   });

// //GET project by Title
// app.route('/api/projects/title/:title') 
//   .get(function(req, res, next){
//     Projects.getProjectByTitle(req.params.title)
//     .then(function(data){
//       res.status(200).json(data);
//     })
//     .catch(function(err){
//       console.error(err.stack);
//       next();
//     });
//   });

app.listen(config.port || 3000, function(){
  console.log('Listening on port:' , config.port);
});

module.exports = app;  




