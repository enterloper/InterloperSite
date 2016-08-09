var knex = require('./../db.js');
var _ = require('lodash');
var Promise = require('bluebird');
var ToyProbs = module.exports;


ToyProbs.getAll = function() {
  return knex("toy_problems")
  .orderBy('id', 'desc');
  };


ToyProbs.getToyProbByID = function(id) {
  return knex("toy_problems")
  .where({
    'id' : id
  });
};

ToyProbs.getToyProbByTitle = function(title) {
  return knex("toy_problems")
  .where({
    'title' : title
  });
};

ToyProbs.getToyProbByDifficulty = function(level) {
  return knex("toy_problems")
  .where({
    'difficulty' : level
  });
};

ToyProbs.addNewToyProblem = function(data) {
  return knex("toy_problems")
  .insert(data);
};

ToyProbs.editToyProblem = function(id, data) {
  return knex("toy_problems")
  .where({
    'id': id
  })
  .limit(1)
  .update(data)
  .then(function(data) {
    console.log(data);
    return data;
  })
  .catch(function(err){
    console.error(err.stack);
  });
};

//DELETE A TOY PROBLEM
ToyProbs.deleteToyProblem = function(id) {
  return knex("toy_problems")
  .where({
    'id': id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post.');
  });
};
/************* TODO ENDPOINTS *************/
// Get bound blog if present
// Get next and previous toy problem