var express    = require('express');
var BlogRouter = express.Router();
var Posts      = require('./../posts/posts_model');
var Path       = require('path');

//SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = Path.resolve(__dirname, '../../public');

/***************** BLOG ROUTING *****************/
BlogRouter.use( express.static(assetFolder) );

BlogRouter.route('/') 
  .get(function(req, res) {
    var posts; 
    Posts.getAll()
    .then(function(data) {
      posts = data;
      }).then(function(data) {
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
      }).then(function(value){
        res.render('blog', value);
      });
  });

BlogRouter.route('/:title') 
  .get(function(req, res, title) {
    var post;
    Posts.getPostByTitle(req.params.title)
    .then(function(data) {
      post = data;
      return post;
    }).then(function(post) {
      var context = {
        id: post[0].blog_id,
        title: post[0].blog_title,
        description: post[0].blog_description,
        body: post[0].blog_body,
        blog_attached: post[0].toy_problem_attached,
        created_at: post[0].created_at
      };
      return context;
    })
    .then(function(value){
      res.render('singleBlog', value);
    });
  });

module.exports = BlogRouter;


