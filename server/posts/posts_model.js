var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var Posts = module.exports;

  Posts.getAll = function() {
    return db('blogs');
  };

  Posts.getPostByID = function(postID) {
    return db('blogs')
    .where({
      'blog_id' : postID
    });
  };

  Posts.getPostByTitle = function(postTitle) {
    return db('blogs')
    .where({
      'blog_title' : postTitle
    });
  };

  Posts.getPostByCategory = function(postCategory) {
    return db('blogs')
    .where({
      'blog_category' : postCategory
    });
  };

  Posts.getByDescription = function(keyword) {
    return db('blogs')
    .where({});
  };

  Posts.addNewBlogPost = function(data) {
    return db('blogs')
    .insert(data);
  };

  Posts.editBlogPost = function() {
    console.log();
    return db('blogs')
    .where('blog_id', '=', 4)
    .update({
      blog_body : "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"
    });
  };
/************* BLOG ENDPOINTS *************/
// Get bound toyproblems if present
// create mods/push/put

// del / delete.del() 
// Aliased to del as delete is a reserved word in javascript, this method deletes one or more rows, based on other conditions specified in the query. Resolves the promise / fulfills the callback with the number of affected rows for the query.

// knex('accounts')
//   .where('activated', false)
//   .del()


// Outputs:
// delete from "accounts" where "activated" = 'false'

// min.min(column) 
// Gets the minimum value for the specified column.

// knex('users').min('age')


// Outputs:
// select min("age") from "users"
// knex('users').min('age as a')


// Outputs:
// select min("age") as "a" from "users"
// max.max(column) 
// Gets the maximum value for the specified column.

// knex('users').max('age')


// Outputs:
// select max("age") from "users"
// knex('users').max('age as a')


// Outputs:
// select max("age") as "a" from "users"

