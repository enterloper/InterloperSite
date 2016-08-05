var express    = require('express');
var APIRouter = express.Router();
var Promise    = require('bluebird');
var Posts      = require('./../posts/posts_model');
var Projects   = require('./../projects/projects_model');
var ToyProbs   = require('./../toy_problems/toy_problems_model');
var path       = require('path');

//SERVE UP THOSE DELICIOUS STATIC FILES!
APIRouter.use( express.static( path.join( __dirname, '/../../public' )) );
APIRouter.use( '/img', express.static( path.join(__dirname, '/../../public/img' )) );
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
  .get(function(req, res, next) {
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
  .post(function(req, res, next) {
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
APIRouter.get('/posts/:id', function(req, res) {
      Posts.getPostByID(req.params.id)
      .then(function(data) {
        res.status(200).json(data);
      })
      .catch(function(err) {
        console.error(err.stack);
      });
});
  //Edit a post
APIRouter.put('/posts/:id',function(req, res, next) {
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
APIRouter.delete('/posts/:id', function(req, res, next) {
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

//GET post by Category
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
//GET ALL toy problems
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

//GET a toy problem by difficulty level
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
//GET all projectsAPIRouter.route('/projects') 
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
APIRouter.get('/projects/:id', function(req, res, next){
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
APIRouter.put('/projects/:id', function(req, res, next){
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
  APIRouter.delete('/projects/:id', function(req, res, next) {
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

