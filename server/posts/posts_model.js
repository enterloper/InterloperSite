var knex = require('./../db.js');
var _ = require('lodash');
var Promise = require('bluebird');
var Posts = module.exports;

/*************** GET ALL BLOGS ***************/
Posts.getAll = function() {
  return knex("blogs")
  .orderBy('id', 'desc');
};
/*************** GET SINGLE BLOG POST ***************/
Posts.getPostByID = function(id) {
  return knex("blogs")
  .where({
    'id' : id
  });
};
/*************** GET POST BY TITLE ***************/
Posts.getPostByTitle = function(title) {
  return knex("blogs")
  .where({
    'title' : title
  });
};
/*************** GET POST BY CATEGORY ***************/
Posts.getPostByCategory = function(category) {
  return knex("blogs")
  .where({
    'category' : category
  });
};
/*************** ADD POST  ***************/
Posts.addNewBlogPost = function(data) {
  return knex("blogs").insert(data);
};
/*************** EDIT POST ***************/

Posts.editBlogPost = function(id, data) {
  return knex("blogs")
  .where({'id': id})
  .limit(1)
  .update(data)
  .then(function(data) {
    console.log(data);
    return data;
  })
  .catch(function(err){
    console.error(err.stack);
  });
};

//DELETE A POST
Posts.deletePost = function(id){ 
  return knex("blogs")
  .where({
    'id': id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post containing: '); 
  }).catch(function(error) {
    console.error(error);
  });
};

  /*
  <-----------TODO: SET UP NEXT AND PREVIOUS QUERIES FOR BUTTONS--------------->
  SELECT
    DISTINCT i.id AS id,
    i.userid AS userid,
    i.itemname AS itemname,
    COALESCE(LEAD(i.id)        OVER (ORDER BY i.created DESC)
            ,FIRST_VALUE(i.id) OVER (ORDER BY i.created DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)) AS nextitemid,
    COALESCE(LAG(i.id)         OVER (ORDER BY i.created DESC)
            ,LAST_VALUE(i.id)  OVER (ORDER BY i.created DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)) AS previtemid,
    COALESCE(LEAD(i.id)        OVER (PARTITION BY i.userid ORDER BY i.created DESC)
            ,FIRST_VALUE(i.id) OVER (PARTITION BY i.userid ORDER BY i.created DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)) AS nextuseritemid,
    COALESCE(LAG(i.id)         OVER (PARTITION BY i.userid ORDER BY i.created DESC)
            ,LAST_VALUE(i.id)  OVER (PARTITION BY i.userid ORDER BY i.created DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)) AS prevuseritemid,
    i.created AS created
  FROM items i
    LEFT JOIN users u
    ON i.userid = u.id
  ORDER BY i.created DESC;
  
  Posts.getPreviousPost = function() {
    console.log(knex("blogs"));
    return knex("blogs")
    .where({ })
  };

  Posts.getNextPost = function() {
    console.log(knex("blogs"));
    return knex("blogs")
    .where({ //id = id -1 OR 1 })
  }
  */


/************* BLOG TODO ENDPOINTS *************/
// Get bound toyproblems if present

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

