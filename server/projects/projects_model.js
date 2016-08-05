var db = require('./../db.js');
var _ = require('lodash');
var Promise = require('bluebird');
var Projects = module.exports;


Projects.getAll = function() {
  return db('projects')
  .orderBy('project_id', 'desc');
};


Projects.getProjectByID = function(id) {
  return db('projects')
  .where({
    'project_id' : id
  });
};

Projects.getProjectByTitle = function(ProjectTitle) {
  return db('projects')
  .where({
    'project_title' : ProjectTitle
  });
};

Projects.addNewProject = function(data) {
  return db('projects')
  .insert(data);
};

Projects.editProject = function(id, data) {
  console.log('{{{{{{{{[[[[[ID & DATA]]]]]}}}}}}}}', id, data);
  return db('projects')
  .where({
    'project_id' : id
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

Projects.deleteProject = function(id) {
  return db('projects')
  .where({
    project_id: id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post.')
  });
};
/************* TODO ENDPOINTS *************/
// Get bound blog if present
// create mods/push/put


