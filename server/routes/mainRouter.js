var express = require('express');
var MainRouter  = express.Router();
var Path    = require('path');

var assetFolder = Path.resolve(__dirname, '../../public');

/***************** HOME PAGE ROUTING *****************/
MainRouter.use( express.static(assetFolder) );
MainRouter.use( express.static(assetFolder + '/img') );

MainRouter.get('/', function(req, res){
  res.render('home');
});

module.exports = MainRouter;