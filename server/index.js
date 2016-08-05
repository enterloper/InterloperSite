var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var Promise         = require('bluebird');
var path            = require('path'); 
var morgan          = require('morgan');
var config          = require('./config/config');
var Handlebars      = require('handlebars');
var exphbs          = require('express-handlebars');
// var APIRouter       = require('./routes/APIRouter.js');
var MainRouter      = require('./routes/mainRouter.js');
var BlogRouter      = require('./routes/blogRouter.js');
var TPRouter        = require('./routes/TPRouter.js');
var ProjectsRouter  = require('./routes/ProjectsRouter.js');
console.log('[[[[[[[[[[INDEX DIR',__dirname);

var Promise    = require('bluebird');
var Posts      = require('./posts/posts_model');
var Projects   = require('./projects/projects_model');
var ToyProbs   = require('./toy_problems/toy_problems_model');





//for production put in NODE_ENV=production node index.js
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

app.set( 'port', (process.env.PORT || 3001) );


//middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
// SERVE UP THOSE DELICIOUS STATIC FILES!
app.use(express.static(__dirname + '/../public'));
app.use('/static', express.static(__dirname+ '/../public/img') );


// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('case sensitive routing', false); 

//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.disable('x-powered-by');
app.param('id', function(req, res, next, id) {
  req.params.id = Number(id);
  next();
});

//ROUTERS
app.use("/", MainRouter); 
// app.use("/api", APIRouter);
app.use("/toy-problems", TPRouter);
app.use("/blog", BlogRouter);
app.use("/portfolio", ProjectsRouter);
// app.use(function(req, res) {
//   res.status(404).render('404');
// });


app.get('/add-content', function(req, res) {
    res.render('additional');
  });

/***************** API HEADER CHECK *****************/
app.get('/headers', function(req, res) {
  res.set('Content-Type', 'text/plain');
  var s = '';
  req.secure;
  for(var name in req.headers) {s += name + ': ' + req.headers[name] + '\n';}
  res.send(s);
});

/***************** BLOG ENDPOINTS *****************/
//GET all posts
app.get('/api/posts', function(req, res, next) {
    Posts.getAll()
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  })
//Add a post
app.post('/api/posts', function(req, res, next) {
    console.log("req.body",res.req.body);
    Posts.addNewBlogPost(req.body)
    .then(function(resp) {
      console.log("[[[[[[[[[[[[[[[[[resp")
      res.status(201).json(res.req.body);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  });

//GET post by ID
app.get('/api/posts/:id', function(req, res) {
      Posts.getPostByID(req.params.id)
      .then(function(data) {
        res.status(200).json(data);
      })
      .catch(function(err) {
        console.error(err.stack);
      });
});
  //Edit a post
app.put('/api/posts/:id',function(req, res, next) {
    console.log("{{{}{}{}{}}}{{}}{req.body", req.body); 
      Posts.editBlogPost(req.params.id, req.body)
      .then(function(resp) {
        console.log("Modified on blog number "+req.params.id+":", res.req.body);
        res.status(200).json(res.req.body);
      })
      .catch(function(err) {
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
      .catch(function(err) {
        console.error(err.stack);
        next();
      });
});

//GET post by Title
app.get('/api/posts/title/:title', function(req, res, next) {
  Posts.getPostByTitle(req.params.title)
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err) {
      console.error(err.stack);
      next();
    });
});

//GET post by Category
app.get('/api/posts/category/:category', function(req, res, next) {
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
//GET ALL toy problems
app.route('/api/problems') 
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
  //Add a toy problems
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

//GET a toy problem by ID
app.route('/api/problems/:id') 
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
  //Edit a Toy Problem
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
  //Delete a post
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

//GET toy problem by Title
app.get('/api/problems/title/:title', function(req, res, next){
    ToyProbs.getToyProbByTitle(req.params.title)
    .then(function(data){
      res.status(200).json(data);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  });

//GET a toy problem by difficulty level
app.get('/api/problems/difficulty/:level', function(req, res, next) {
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
//GET all projects
app.route('/api/projects') 
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
  //Add a post
  .post(function(req, res, next) {
    Projects.addNewProject(req.body)
    .then(function(resp) {
      console.log("resp", resp);
      console.log("res.req.body:",res.req.body);  
      res.status(201).json(res.req.body);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
});


//GET project by ID
app.get('/api/projects/:id', function(req, res, next){
    Projects.getProjectByID(req.params.id)
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err) {
      console.error(err.stack);
      next();
    });
  });
  //Edit a project
app.put('/api/projects/:id', function(req, res, next){
    Projects.editProject(req.params.id, req.body)
    .then(function(resp) {
      console.log('<KKKKKKKKKKKKKKKKKKKKKKK>res',resp);
      console.log("Modified on project number "+req.params.id+":", res.req.body);
      res.status(200).json(res.req.body);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  });
  //Delete a project
  app.delete('api/projects/:id', function(req, res, next) {
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

//GET project by Title
app.get('/api/projects/title/:title', function(req, res, next) {
  Projects.getProjectByTitle( req.params.title )
  .then(function(data) {
    res.status(200).json(data);
  })
  .catch(function(err) {
    console.error(err.stack);
    next();
  });
});
//ERROR HANDLING FOR RESPONSE CODES OTHER THAN 200
// app.get('/error', function(err, req, res, next) {
//   //set status to 500 and render error page
//   console.error(err.stack);
//   res.status(500).render('500');
// });

// app.use(function(err, req, res, next) {
//     console.error(err.stack);
//     res.status(500).render('500');
// });

app.listen(app.get('port'), function(){
  console.log('Node app is running on port:' , app.get('port'));
});

module.exports = app;  




