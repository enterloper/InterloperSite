var knex = require('./../db.js');
var _ = require('lodash');
var Promise = require('bluebird');
var Projects = module.exports;

//GET ALL PROJECTS
Projects.getAll = function() {
  return knex("projects")
  .orderBy('id', 'desc');
};


Projects.getProjectByID = function(id) {
  return knex("projects")
  .where({
    'id' : id
  });
};

Projects.getProjectByTitle = function(ProjectTitle) {
  return knex("projects")
  .where({
    'title' : ProjectTitle
  });
};

Projects.addNewProject = function(data) {
  return knex("projects")
  .insert(data);
};

Projects.editProject = function(id, data) {
  return knex("projects")
  .where({
    'id' : id
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

Projects.deleteProject = function(id) {
  return knex("projects")
  .where({
    id: id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post.');
  });
};
/************* TODO ENDPOINTS *************/
// Get bound blog if present
// create mods/push/put


