var express           = require('express');
var ProjectsRouter    = express.Router();
var Projects          = require('./../projects/projects_model');

/***************** PORTFOLIO ROUTING *****************/

/***************** GET ALL PROJECTS *****************/

ProjectsRouter.get('/', function(req, res, next) {
    var projects; 
    Projects.getAll()
    .then( function(data) {
      projects = data;
      return projects;
    })
    .then(function(projects) {
      var context = {
        projects: projects.map(function(project) {
          return {
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.image,
            url: project.url
          };
        })
      };

      res.render('portfolio', context);
      });
  });

module.exports = ProjectsRouter;
