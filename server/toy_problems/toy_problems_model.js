var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var ToyProbs = module.exports;


ToyProbs.getAll = function() {
  return db('toy_problems');
};


ToyProbs.getToyProb = function() {};

ToyProbs.getByTitle = function() {};

ToyProbs.getById = function() {};

ToyProbs.getByDifficulty =function() {};