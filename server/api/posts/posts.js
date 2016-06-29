var _ = require('lodash');
var promise = require('bluebird');
var blogRouter = require('express').Router();
var db = require('../../db');
var Posts = module.exports;


var id = 0;

var updateId = function(req, res, next) {
  if (!req.body.id) {
    id++;
    req.body.id = id + '';
  }
  next();
};

blogRouter.param('id', function(req, res, next, id) {
  var blog = _.find(blogs, {id: id})

  if (blog) {
    req.blog = blog;
    next();
  } else {
    res.send();
  }
});

blogRouter.route('/') 
  .get(function(req, res){
    res.json(blogs);
  })
  .post(updateId, function(req, res) {
    var blog = req.body;

    blogs.push(blog);

    res.json(blog);
  });

blogRouter.route('/:id')
  .get(function(req, res){
    var blog = req.blog;
    res.json(blog || {});
  }).delete(function(req, res) {
  var blog = _.findIndex(blogs, {id: req.params.id});
  blogs.splice(blog, 1);
  res.json(req.blog);
}).put(function(req, res) {
  var update = req.body;
  if (update.id) {
    delete update.id
  }
  var blog = _.findIndex(blogs, {id: req.params.id});
  if (!blogs[blog]) {
    res.send();
  } else {
    var updatedblog = _.assign(blogs[blog], update);
    res.json(updatedblog);
  }
});

module.exports = blogRouter;


