var express     = require('express');
var MainRouter  = express.Router();
var Path        = require('path');

// //SERVE UP THOSE DELICIOUS STATIC FILES!
console.log('MAIN DIRNAME:', __dirname);
var assetFolder = Path.resolve(__dirname, './../../public');
console.log('MAIN ASSETFOLER:',assetFolder);
MainRouter.use( express.static(assetFolder) );
app.use('/img', express.static(__dirname + './../../public/img'));
/***************** HOME PAGE ROUTING *****************/
MainRouter.get('/', function(req, res){
  res.render('home');
});

module.exports = MainRouter;