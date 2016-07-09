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


// Users.updateExp = function(githubUsername){
//   return db('users')
//   .where({'github_username': githubUsername})
//   .then(function(users){
//     let user = users[0];
//     let newExp = Character.getExpFromContribs(user.contributions) + Character.getExpFromHonor(user.honor)
//     return db('users')
//     .returning('*')
//     .where({
//       'id': user.id,
//       'experience': newExp
//     });
//   });
// };
//Users.update: new database row for user => updated row for user
// Users.update = function(obj){
//   return db('users').where({
//     passid: obj.id
//   }).limit(1)
//   .update(obj.form)  
//   .then(function(data){
//     return data;
//   });
// };
//Edit a post
  Posts.editBlogPost = function(id, data) {
    console.log('id',id,'data',data);
    return db('blogs')
    .where({
      blog_id: id
    }).limit(1)
    .update(data)
    .then(function(data) {
      console.log(data);
      return data;
    })
    .catch(function(err){
      console.error(err);
    });
  };

//Delete a post
  Posts.deletePost = function(id){ 
    return db('blogs')
    .where('blog_id', '=', id)
    .del()
    .then(function(data) {
      console.log('Deleted '+data+' blog post.');
    }).catch(function(error) {
      console.error(error);
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

