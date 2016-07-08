var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var _               = require('lodash');
var path            = require('path'); 
var morgan          = require('morgan');
var config          = require('./config/config');
var Posts            = require('./posts/posts_model');
var ToyProbs         = require('./toy_problems/toy_problems_model');
var db              = require('./db');
var router          = require('./routes/router');
//rootPath for path to client directory => Interloper/client
var rootPath = path.normalize(__dirname + './../client');
//serve static files in client directory, without processing them.
app.use("/pages", express.static(rootPath + '/pages'));
app.use("/style", express.static(rootPath + '/style'));
app.use("/img", express.static(rootPath + '/img'));
app.use("/lib", express.static(rootPath + '/lib'));
app.use("/src", express.static(rootPath + '/src'));
app.use("/routes/router", router);

//middleware
// app.use(morgan('dev'));
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use('/blog/', Post.getAll);
app.use(function(err, req, res, next) {
  if (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});
//Site Routing
app.get('/', function(req, res) {
    res.sendFile(path.join(rootPath+'/index.html'));
});

app.get('/toyProblems', function(req, res) {
    res.sendFile(path.join(rootPath+'/pages/toyProblems.html'));
});

app.get('/blog', function(req, res) {
  res.sendFile(path.join(rootPath+'/pages/blog.html'));
});

app.get('/portfolio', function(req, res) {
  res.sendFile(path.join(rootPath+'/pages/portfolio.html'));
});

/***************** BLOG ENDPOINTS *****************/

app.get('/posts', function(req, res, next) {
  Posts.getAll()
  .then(function(data) {
    console.log(data);
    res.send(data);
  }).catch(next);
});


app.get('/posts/id/:postID', function(req, res, next){
  Posts.getPostByID(req.params.postID)
  .then(function(data){
    console.log(data);
    res.send(data);
  }).catch(next);
});

app.get('/posts/category/:category', function(req, res, next) {
  Posts.getPostByCategory(req.params.category)
  .then(function(data) {
    console.log(data);
    res.send(data);
  }).catch(next);
});

var newDummyBlog = {
  "blog_title":"Express yourself",
  "blog_category":"Server",
  "blog_description":"This is a tale about Express, Node and Knex",
  "blog_body":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "toy_problem_attached": false
};
app.post('/posts/add', function(req, res, next){
  Posts.addNewBlogPost(newDummyBlog)
  .then(function(resp) {
    console.log(resp);
    res.send(resp);
  }).catch(next);
});

var modBlog = {
  "blog_id": 4,
  "blog_body":"blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"
};

app.put('/posts/put', function(req,res, next){
  console.log('WE IN PUT')
  Posts.editBlogPost(modBlog)
  .then(function(resp) {
    console.log(resp);
    res.send(resp);
  }).catch(next);
});
/************* TOY PROBLEM ENDPOINTS *************/

app.get('/problems', function(req, res, next) {
  ToyProbs.getAll()
  .then(function(resp) {
    console.log(resp);
    res.send(resp);
  }).catch(next);
});

app.get('/problems/:toyProbID', function(req, res, next){
  ToyProbs.getToyProbByID(req.params.toyProbID)
  .then(function(data){
    console.log(data);
    res.send(data);
  }).catch(next);
});

app.get('/problems/difficulty/:level', function(req, res, next) {
  ToyProbs.getToyProbByDifficulty(req.params.level)
  .then(function(data) {
    console.log(data);
    res.send(data);
  }).catch(next);
});

/************* PORTFOLIO ENDPOINTS *************/
//TODO - PORTOFOLIO ENDPOINTS.

app.listen(config.port || 3000, function(){
  console.log('Listening on port:' , config.port);
});

module.exports=app;  
