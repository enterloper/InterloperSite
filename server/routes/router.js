var express = require('express');
var router  = express.Router();
var Path    = require('path');

var assetFolder = Path.resolve(__dirname, '../../client');

router.use( express.static(assetFolder) );
console.log('assetFolder',assetFolder);

module.exports = router;