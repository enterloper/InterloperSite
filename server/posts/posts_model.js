var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var Posts = module.exports;

  Posts.getAll = function() {
    return db('blogs');
  };

  Posts.getPostByID = function(postID) {
    return db('blogs').where({
      'blog_id': postID
    });
  };

  Posts.getPostByTitle = function(postTitle) {
    return db('blogs').where({
      'blog_title': postTitle
    });
  };

  Posts.getPostByCategory = function(postCategory) {
    return db('blogs').where({
      'blog_category': postCategory
    });
  };

  Posts.getByDescription =function(keyword) {
    return db('blogs').where({})
  };

  