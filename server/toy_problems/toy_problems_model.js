var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var ToyProbs = module.exports;


ToyProbs.getAll = function() {
  return db('toy_problems')
  .orderBy('toy_problems_id', 'desc');
};


ToyProbs.getToyProbByID = function(id) {
  return db('toy_problems')
  .where({
    'toy_problems_id' : id
  });
};

ToyProbs.getToyProbByTitle = function(toyProbTitle) {
  return db('toy_problems').where({
    'toy_problem_title' : toyProbTitle
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
  console.log('id',id, 'data',data);
  return db('toy_problems')
  .where({
    toy_problems_id: id
  })
  .limit(1)
  .update(data)
  .then(function(data) {
    console.log(data);
    return data;
  })
  .catch(function(err){
    console.error(err.stack)
  });
};
/************* TODO ENDPOINTS *************/
// Get bound blog if present
// create mods/push/put