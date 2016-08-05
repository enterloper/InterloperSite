var express     = require('express');
var MainRouter  = express.Router();
var path        = require('path');
console.log('[[[[[[[[[[MAIN DIR',__dirname);
// SERVE UP THOSE DELICIOUS STATIC FILES!
MainRouter.use( express.static( path.join( __dirname, '/../../public' )) );
MainRouter.use( '/img', express.static( path.join( __dirname, '/../../public/img' )) );

/***************** HOME PAGE ROUTING *****************/
MainRouter.get('/', function(req, res){
  res.render('home');
});

module.exports = MainRouter;