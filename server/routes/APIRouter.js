var express    = require('express');
var APIRouter = express.Router();
var Posts      = require('./../posts/posts_model');
var Projects   = require('./../projects/projects_model');
var ToyProbs   = require('./../toy_problems/toy_problems_model');
var path       = require('path');
var Promise    = require('bluebird');

//SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = path.resolve(__dirname, '../../public');

/***************** BLOG ROUTING *****************/
APIRouter.use( express.static(assetFolder) );

APIRouter.get('/add-content', function(req, res) {
    res.render('additional');
  });

/***************** API HEADER CHECK *****************/
APIRouter.route('/headers') 
  .get(function(req, res) {
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
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  })
//Add a post
  .post(function(req, res) {
    Posts.addNewBlogPost(req.body)
    .then(function(resp) {
      res.status(201).json(res.req.body);
    })
    .catch(function(err) {
      console.error(err.stack);
    });
  });

//GET post by ID
APIRouter.route('/posts/:id')
    .get(function(req, res) {
      Posts.getPostByID(req.params.id)
      .then(function(data){
        res.status(200).json(data);
      }).catch(function(err) {
        console.error(err.stack);
      });
    })
  //Edit a post
    .put(function(req, res, next){
      Posts.editBlogPost(req.params.id, req.body)
      .then(function(resp) {
        console.log("Modified on blog number "+req.params.id+":", res.req.body);
        res.status(200).json(res.req.body);
      })
      .catch(function(err){
        console.error(err.stack);
        next();
      });
    })
  //Delete a post
    .delete(function(req, res, next) {
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
APIRouter.route('/posts/title/:title') 
  .get(function(req, res, next){
    Posts.getPostByTitle(req.params.title)
    .then(function(data){
      res.status(200).json(data);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  });

//GET post by Category
APIRouter.route('/posts/category/:category')
  .get(function(req, res, next) {
    Posts.getPostByCategory(req.params.category)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err){
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
      .catch(function(err){
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
      .catch(function(err) {
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
      });
    });

//GET toy problem by Title
APIRouter.route('/problems/title/:title')
  .get(function(req, res, next){
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
APIRouter.route('/problems/difficulty/:level')
  .get(function(req, res, next) {
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
      res.status(201).json(res.req.body);
    })
    .catch(function(err) {
      console.error(err.stack);
      next();
    });
  });


//GET project by ID
APIRouter.route('/projects/:id')
  .get(function(req, res, next){
    Projects.getProjectByID(req.params.id)
    .then(function(data){
      res.status(200).json(data);
    })
    .catch(function(err) {
      console.error(err.stack);
      next();
    });
  })
  //Edit a project
  .put(function(req, res, next){
    Projects.editProject(req.params.id, req.body)
    .then(function(resp) {
      console.log("Modified on project number "+req.params.id+":", res.req.body);
      res.status(200).json(res.req.body);
    })
    .catch(function(err){
      console.error(err.stack);
    });
  })
  //Delete a project
  .delete(function(req, res, next) {
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
APIRouter.route('/projects/title/:title') 
  .get(function(req, res, next){
    Projects.getProjectByTitle(req.params.title)
    .then(function(data){
      res.status(200).json(data);
    })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  });

module.exports = APIRouter;

