var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var ToyProb = module.exports;


ToyProb.getAll = function() {
  return db('blogs');
};


ToyProb.getToyProb = function() {};

ToyProb.getByTitle = function() {};

ToyProb.getById = function() {};

ToyProb.getByDifficulty =function() {};