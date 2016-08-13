var express  = require('express');
var TPRouter = express.Router();
var ToyProbs = require('./../toy_problems/toy_problems_model');
var path     = require('path');
var Promise  = require('bluebird');

/***************** TOY PROBLEM ROUTING *****************/

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
    ToyProbs.getToyProbByTitle(req.params.title)
    .then(function(data) {
      toy_problem = data;
      return toy_problem;
    })
    .then(function(toy_problem) {
      console.log('TOYPROBLEMS', toy_problem);
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
      console.log('TOYPROBLEMS', toy_problem);
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

