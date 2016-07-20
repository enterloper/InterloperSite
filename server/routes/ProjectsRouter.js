var express       = require('express');
var ProjectsRouter    = express.Router();
var Projects      = require('./../projects/projects_model');
var path          = require('path');
/***************** PORTFOLIO ROUTING *****************/

var assetFolder = path.resolve(__dirname, '../../public');

ProjectsRouter.route('/')
  .get(function(req, res) {
    var projects; 
    Projects.getAll()
    .then(function(data) {
      projects = data;
    })
    .then(function(data) {
      var context = {
        projects: projects.map(function(project) {
          return {
            id: project.project_id,
            title: project.project_title,
            description: project.project_description
          };
        })
      };
      return context;
    })
    .then(function(value){
        res.render('portfolio', value);
      });
  });

module.exports = ProjectsRouter;