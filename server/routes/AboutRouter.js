var express      = require('express');
var AboutRouter  = express.Router();

AboutRouter.get('/', function(req, res) {
    res.render('about');
});

//RESUME PAGE ROUTING
AboutRouter.get('/resume', function(req, res) {
    res.render('resume');
});

module.exports = AboutRouter;

