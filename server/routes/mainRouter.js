var express     = require('express');
var MainRouter  = express.Router();
var Path        = require('path');

// //SERVE UP THOSE DELICIOUS STATIC FILES!
var assetFolder = Path.resolve(__dirname + './../../public');
MainRouter.use( express.static(assetFolder) );

/***************** HOME PAGE ROUTING *****************/
MainRouter.get('/', function(req, res){
  res.render('home');
});

module.exports = MainRouter;