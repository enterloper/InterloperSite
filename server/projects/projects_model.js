var knex = require('./../db.js');
var Promise = require('bluebird');
var Projects = module.exports;

//GET ALL PROJECTS
Projects.getAll = function() {
  return knex('projects')
  .orderBy('id', 'desc');
};

//GET PROJECT BY ID
Projects.getProjectByID = function(id) {
  return knex('projects')
  .where({
    'id' : id
  });
};

//GET PROJECT BY TITLE
Projects.getProjectByTitle = function(ProjectTitle) {
  return knex('projects')
  .where({
    'title' : ProjectTitle
  });
};

//ADD A PROJECT
Projects.addNewProject = function(data) {
  return knex('projects')
  .insert(data);
};

//EDIT A PROJECT
Projects.editProject = function(id, data) {
  return knex('projects')
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

//DELETE A PROJECT
Projects.deleteProject = function(id) {
  return knex('projects')
  .where({
    id: id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post.');
  });
};

//GET BOUND BLOG
Projects.getBlogMatches = function() {
  return knex
  .table('projects')
  .select('projects.title', 'projects.description')
  .join('blogs', 'projects.title', '=', 'blogs.title');
};

/************* TODO ENDPOINTS *************/
// create mods/push/put


