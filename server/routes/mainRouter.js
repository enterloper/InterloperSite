var express     = require('express');
var MainRouter  = express.Router();
var Path        = require('path');

// SERVE UP THOSE DELICIOUS STATIC FILES!
MainRouter.use( express.static('public') );
MainRouter.use( '/img', express.static('img') );

/***************** HOME PAGE ROUTING *****************/
MainRouter.get('/', function(req, res){
  res.render('home');
});

module.exports = MainRouter;