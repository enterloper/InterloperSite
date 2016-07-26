var express = require('express');
var MainRouter  = express.Router();
var Path    = require('path');

var assetFolder = Path.resolve(__dirname, '../../public');

/***************** DEFAULT ROUTING *****************/
MainRouter.use( express.static(assetFolder) );

MainRouter.get('/*', function(req, res){

  res.sendFile( assetFolder + '/main.handlebars' )
    
});

module.exports = MainRouter;