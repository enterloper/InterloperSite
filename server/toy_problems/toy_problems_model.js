var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var ToyProbs = module.exports;


ToyProbs.getAll = function() {
  return db('toy_problems');
};


ToyProbs.getToyProbByID = function(toyProbID) {
  return db('toy_problems').where({
    'toy_problems_id' : toyProbID
  });
};

ToyProbs.getToyProbByTitle = function(toyProbTitle) {
  return db('toy_problems').where({
    'toy_problem_title' : toyProbTitle
  });
};

ToyProbs.getToyProbByDifficulty = function(level) {
  return db('toy_problems').where({
    'toy_problem_difficulty' : level
  });
};

/************* TODO ENDPOINTS *************/
// Get bound blog if present
// create insertion for toyProbs
// create mods/push/put