var knex = require('./../db.js');
var Promise = require('bluebird');
var ToyProbs = module.exports;

/*************** GET ALL TOY PROBLEMS ***************/
ToyProbs.getAll = function() {
  return knex('toy_problems')
  .orderBy('id', 'desc');
  };

/*************** GET TOY PROBLEM BY ID ***************/
ToyProbs.getToyProbByID = function(id) {
  return knex('toy_problems')
  .where({
    'id' : id
  });
};

/*************** GET TOY PROBLEM BY TITLE***************/
ToyProbs.getToyProbByTitle = function(title) {
  return knex('toy_problems')
  .where({
    'title' : title
  });
};

/*************** GET TOY PROBLEMS BY DIFFICULTY ***************/
ToyProbs.getToyProbByDifficulty = function(level) {
  return knex('toy_problems')
  .where({
    'difficulty' : level
  });
};

/*************** ADD A SINGLE TOY PROBLEM ***************/
ToyProbs.addNewToyProblem = function(data) {
  return knex('toy_problems')
  .insert(data);
};

/*************** EDIT SINGLE TOY PROBLEM ***************/
ToyProbs.editToyProblem = function(id, data) {
  return knex('toy_problems')
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

/*************** DELETE A TOY PROBLEM ***************/
ToyProbs.deleteToyProblem = function(id) {
  return knex('toy_problems')
  .where({
    'id': id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post.');
  });
};

/*************** GET BOUND BLOG ***************/
ToyProbs.getBlogMatches = function() {
  return knex
  .table('blogs')
  .select('blogs.title', 'blogs.description')
  .join('toy_problems', 'blogs.title', '=', 'toy_problems.title');
};
/************* TODO ENDPOINTS *************/
// Get next and previous toy problem