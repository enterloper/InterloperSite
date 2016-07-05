var db = require('../db');
var _ = require('lodash');
var Promise = require('bluebird');
var Post = module.exports;

getAll = function() {
  return db('blogs');
};
console.log(getAll());

Post.getPost = function() {};

Post.getByTitle = function() {};

Post.getById = function() {};

Post.getByCategory = function() {};

Post.getByDescription =function() {};