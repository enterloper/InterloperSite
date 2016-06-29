var _ = require('lodash');
var blogRouter = require('express').Router();

var blogs = [];
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

blogRouter.get('/', function(req, res){
  res.json(blogs);
});

blogRouter.get('/:id', function(req, res){
  var blog = req.blog;
  res.json(blog || {});
});

blogRouter.post('/', updateId, function(req, res) {
  var blog = req.body;

  blogs.push(blog);

  res.json(blog);
});

blogRouter.delete('/:id', function(req, res) {
  var blog = _.findIndex(blogs, {id: req.params.id});
  blogs.splice(blog, 1);

  res.json(req.blog);
});

blogRouter.put('/:id', function(req, res) {
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


