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
      return context;
    })
    .then(function(context){
      console.log('------------>C',context);
      res.render('portfolio', context);
    })
    .catch( function(err){
      console.error(err.stack);
      next();
    });
  });

module.exports = ProjectsRouter;
