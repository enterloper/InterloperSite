var express     = require('express');
var MainRouter  = express.Router();
var Path        = require('path');

var assetFolder = Path.resolve(__dirname, '../../public');
MainRouter.use( express.static(assetFolder) );

/***************** HOME PAGE ROUTING *****************/
MainRouter.get('/', function(req, res){
  res.render('home');
});

module.exports = MainRouter;