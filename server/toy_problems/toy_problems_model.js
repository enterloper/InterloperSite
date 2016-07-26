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