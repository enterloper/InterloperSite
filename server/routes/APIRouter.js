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

