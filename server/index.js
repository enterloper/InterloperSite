var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var _               = require('lodash');
var morgan          = require('morgan');
var config          = require('./config/config');
var Post            = require('./posts/posts_model');
var ToyProb            = require('./toy_problems/toy_problems_model');
var Path            = require('path');
var db              = require('./db');
  
//rootPath for path to app directory
var rootPath = Path.normalize(__dirname + '../client');

//serve file in app directory, without processing them.
app.use("/app", express.static(rootPath + '/app'));
app.use("/lib", express.static(rootPath + '/lib'));
app.use("/style", express.static(rootPath + '/style'));

//middleware
app.use(morgan('dev'));
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/posts/', Post.getAll);
app.use(function(err, req, res, next) {
  if (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

app.listen(config.port || 3000, function(){
  console.log('Listening on port:' , config.port);
});

module.exports=app;  
