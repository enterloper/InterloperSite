var express  = require('express');
var TPRouter = express.Router();
var ToyProbs = require('./../toy_problems/toy_problems_model');
var path     = require('path');

//SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = path.resolve(__dirname, '../../public');

/***************** TOY PROBLEM ROUTING *****************/
TPRouter.use( express.static(assetFolder) );

TPRouter.get('/', function(req, res) {
    var toy_problems; 
    ToyProbs.getAll()
    .then(function(data) {
      toy_problems = data;
      return toy_problems;
    })
    .then(function(data) {
      // console.log('data20', data);
        var context = {
          toy_problems: toy_problems.map(function(toy_problem) {
            return {
              id: toy_problem.toy_problem_id,
              title: toy_problem.toy_problem_title,
              description: toy_problem.toy_problem_description
            };
          })
        };
        // console.log('context', context);
        return context;
      })
    .then(function(value){
        res.render('toyProblems', value);
      })
    .catch(function(err) {
      // console.error(err.stack)
    });
  });

TPRouter.get('/:title', function(req, res, title) {
    var toy_problem;
    ToyProbs.getToyProbByTitle(req.params.title)
    .then(function(data) {
      // console.log('data42', data)
      toy_problem = data;
      return toy_problem;
    })
    .then(function(toy_problem) {
      // console.log('toy_problem',toy_problem); 
      var context = {
        id: toy_problem[0].toy_problem_id,
        title: toy_problem[0].toy_problem_title,
        description: toy_problem[0].toy_problem_description,
        body: toy_problem[0].toy_problem_body,
        blog_attached: toy_problem[0].blog_attached,
        created_at: toy_problem[0].created_at
      };
      return context;
    })
    .then(function(value){
      res.render('singleToyProblem', value);
    })
    .catch(function(err) {
      console.error(err);
    });
  });

module.exports = TPRouter;

