var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var _               = require('lodash');
var path            = require('path'); 
var morgan          = require('morgan');
var config          = require('./config/config');
var Posts           = require('./posts/posts_model');
var ToyProbs        = require('./toy_problems/toy_problems_model');
var db              = require('./db');
var router          = require('./routes/router');
var handlebars      = require('express-handlebars').create({defaultLayout: 'main'});
//rootPath for path to client directory => Interloper/client
var rootPath = path.normalize(__dirname + './../client');
// Set up Handlebars engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//serve static files in client directory, without processing them.
app.use("/pages", express.static(rootPath + '/pages'));
app.use("/style", express.static(rootPath + '/style'));
app.use("/img", express.static(rootPath + '/img'));
app.use("/lib", express.static(rootPath + '/lib'));
app.use("/src", express.static(rootPath + '/src'));
app.use("/routes/router", router);

//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.disable('x-powered-by');
//middleware
app.use(morgan('dev'));
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//REQUEST HEADERS CHECK
app.get('/headers', function(req, res) {
  res.set('Content-Type', 'text/plain');
  var s = '';
  req.secure;
  for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});



//Site Routing
// app.get('/', function(req, res) {
//     res.sendFile(path.join(rootPath+'/index.html'));
// });
app.get('/', function(req, res){
  res.render('home');
});

app.get('/toyProblems', function(req, res) {
    res.render('toyProblems');
});

app.get('/blog', function(req, res) {
  res.render('blog');
});

app.get('/portfolio', function(req, res) {
  res.render('portfolio');
});

/***************** BLOG ENDPOINTS *****************/
//GET all posts
app.get('/posts', function(req, res, next) {
  Posts.getAll()
  .then(function(data) {
    console.log(data);
    res.send(data);
  }).catch(next);
});

//GET post by ID
app.get('/posts/id/:postID', function(req, res, next){
  Posts.getPostByID(req.params.postID)
  .then(function(data){
    console.log('[[PARAMS]] :',req.params.postID)
    console.log('[[data]] : ',data);
    res.send(data);
  }).catch(next);
});

//GET post by Title
app.get('/posts/title/:title', function(req, res, next){
  Posts.getPostByTitle(req.params.title)
  .then(function(data){
    console.log(data);
    res.send(data);
  }).catch(next)
});

//GET post by Category
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

//Add a post by
app.post('/posts/add', function(req, res, next){
  Posts.addNewBlogPost(newDummyBlog)
  .then(function(resp) {
    console.log('resp IN app.post:',resp);
    res.send(resp);
  }).catch(next);
});

var modBlog = {
  "blog_id": 4,
  "blog_body":"blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"
};

//Edit a post
app.put('/posts/id/modify/:id', function(req,res, next){
  console.log('WE IN PUT')
  Posts.editBlogPost(modBlog)
  .then(function(resp) {
    console.log(resp);
    res.send(resp);
  }).catch(next);
});

/************* TOY PROBLEM ENDPOINTS *************/

//GET ALL toy problems
app.get('/problems', function(req, res, next) {
  ToyProbs.getAll()
  .then(function(resp) {
    console.log(resp);
    res.send(resp);
  }).catch(next);
});

//GET a toy problem by ID
app.get('/problems/:toyProbID', function(req, res, next){
  ToyProbs.getToyProbByID(req.params.toyProbID)
  .then(function(data){
    console.log(data);
    res.send(data);
  }).catch(next);
});

//GET a toy problem by difficulty level
app.get('/problems/difficulty/:level', function(req, res, next) {
  ToyProbs.getToyProbByDifficulty(req.params.level)
  .then(function(data) {
    console.log(data);
    res.send(data);
  }).catch(next);
});

/************* PORTFOLIO ENDPOINTS *************/
//TODO - PORTOFOLIO ENDPOINTS.

//ERROR HANDLING FOR RESPONSE CODES OTHER THAN 200
app.get('/error', function(req, res) {
  //set status to 500 and render error page
  res.status(500).render('error');
});

app.listen(config.port || 3000, function(){
  console.log('Listening on port:' , config.port);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500');
});

app.use(function(req, res) {
  res.status(404).render('404');
});

module.exports=app;  
