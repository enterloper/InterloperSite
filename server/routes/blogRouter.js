var express    = require('express');
var BlogRouter = express.Router();
var Posts      = require('./../posts/posts_model');
var path       = require('path');
var Promise    = require('bluebird');

// SERVE UP THOSE DELICIOUS STATIC FILES!
BlogRouter.use( express.static('public') );

/***************** BLOG ROUTING *****************/

BlogRouter.get('/', function(req, res, next) {
    var posts; 
    Posts.getAll()
    .then(function(data) {
      posts = data;
      return posts; 
    })
    .then(function(data) {
        var context = {
          posts: posts.map(function(post) {
            return {
              id: post.blog_id,
              title: post.blog_title,
              description: post.blog_description,
              image: post.image_source
            };
          })
        };
        return context;
      })
    .then(function(value){
        res.render('blog', value);
      })
    .catch(
      // console.error(err.stack);
      next
    );
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
        id: post[0].blog_id,
        title: post[0].blog_title,
        description: post[0].blog_description,
        body: post[0].blog_body,
        blog_attached: post[0].toy_problem_attached,
        image: post[0].blog_image,
        created_at: post[0].created_at
      };
      return context;
    })
    .then(function(value){
      res.render('singleBlog', value);
    })
    .catch(
      // console.error(err);
      next
    );
  });

module.exports = BlogRouter;


