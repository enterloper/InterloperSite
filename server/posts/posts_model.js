var db = require('./../db.js');
var _ = require('lodash');
var Promise = require('bluebird');
var Posts = module.exports;
  Posts.Hallo = function() {
  console.log('HAlllooooooooo!!!');
}
/*************** GET ALL BLOGS ***************/
Posts.getAll = function() {

  return db("blogs")
  .orderBy('blog_id', 'desc');
};
/*************** GET SINGLE BLOG POST ***************/
Posts.getPostByID = function(id) {
  return db("blogs")
  .where({
    'blog_id' : id
  });
};
/*************** GET POST BY TITLE ***************/
Posts.getPostByTitle = function(title) {
  return db("blogs")
  .where({
    'blog_title' : title
  });
};

Posts.getPostByCategory = function(category) {
  return db("blogs")
  .where({
    'blog_category' : category
  });
};

Posts.addNewBlogPost = function(data) {
  console.log("dataaaaaaaaaaaaaa",data);
  return db("blogs").insert(data);
};

Posts.editBlogPost = function(id, data) {
  return db("blogs")
  .where({'blog_id': id})
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
  return db("blogs")
  .where({
    'blog_id': id
  })
  .del()
  .then(function(data) {
    console.log('Deleted '+data+' blog post.'); 
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
    console.log(db("blogs"));
    return db("blogs")
    .where({ })
  };

  Posts.getNextPost = function() {
    console.log(db("blogs"));
    return db("blogs")
    .where({ })
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

