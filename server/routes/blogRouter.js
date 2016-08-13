var express    = require('express');
var BlogRouter = express.Router();
var Posts      = require('./../posts/posts_model');
var path       = require('path');
var Promise    = require('bluebird');

/***************** BLOG ROUTING *****************/

/***************** GET ALL BLOGS *****************/

BlogRouter.get('/', function(req, res, next) {
    var posts; 
    Posts.getAll()
    .then(function(data) {
      console.log(data);
      posts = data;
      return posts; 
    })
    .then(function(data) {
        var context = {
          posts: posts.map(function(post) {
            return {
              id: post.id,
              title: post.title,
              description: post.description,
              image: post.image
            };
          })
        };
        return context;
      })
    .then(function(value){
        res.render('blog', value);
      })
    .catch(function(err){
      console.error(err.stack);
      next();
    });
  });

BlogRouter.get('/:title', function(req, res, next) {
    var post;
    Posts.getPostByTitle(req.params.title)
    .then(function(data) {
      post = data;
      return post;
    })
    .then(function(post) {
      var context = {
        id: post[0].id,
        title: post[0].title,
        description: post[0].description,
        body: post[0].body,
        image: post[0].image,
        created_at: post[0].created_at
      };
      return context;
    })
    .then(function(value){
      res.render('singleBlog', value);
    })
    .catch(function(err){
      console.error(err);
      next();
    });
  });

module.exports = BlogRouter;


