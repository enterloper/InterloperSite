var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var _               = require('lodash');
var path            = require('path'); 
var morgan          = require('morgan');
var config          = require('./config/config');
var Post            = require('./posts/posts_model');
var ToyProb         = require('./toy_problems/toy_problems_model');
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

app.listen(config.port || 3000, function(){
  console.log('Listening on port:' , config.port);
});

module.exports=app;  
