var express           = require('express');
var ProjectsRouter    = express.Router();
var Projects          = require('./../projects/projects_model');
var path              = require('path');

//SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = path.resolve(__dirname, '../../public');
ProjectsRouter.use( express.static(assetFolder) );

/***************** PORTFOLIO ROUTING *****************/

ProjectsRouter.get('/', function(req, res, next) {
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
            description: project.project_description,
            image: project.project_image,
            url: project.project_url
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