var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var Promise         = require('bluebird');
// var _               = require('lodash');
var path            = require('path'); 
var morgan          = require('morgan');
var config          = require('./config/config');
// var Posts           = require('./posts/posts_model');
// var ToyProbs        = require('./toy_problems/toy_problems_model');
// var Projects        = require('./projects/projects_model');
var db              = require('./db');
var Handlebars      = require('handlebars');
var exphbs          = require('express-handlebars');
var BlogRouter      = require('./routes/blogRouter.js');
var TPRouter        = require('./routes/TPRouter.js');
var ProjectsRouter  = require('./routes/ProjectsRouter.js');
var APIRouter       = require('./routes/APIRouter.js');
var MainRouter      = require('./routes/mainRouter.js');

//for production put in NODE_ENV=production node index.js
// SERVE UP THOSE DELICIOUS STATIC FILES!

app.use( express.static('public') );
app.use( '/img', express.static('img') );

// Set up Handlebars engine
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    static: function(name) {
      return require('./static.js').map(name);
    }
  },
  partialsDir: [
    'server/views/shared/templates',
    'server/views/partials'
  ],
  layoutsDir: 'server/views/layouts'
});

app.set( 'port', (process.env.PORT || 3000) );


//middleware
//serve static files in public directory, without processing them.
// app.use( '/img', express.static(assetFolder + '/img') );
// app.use( '/style', express.static(assetFolder + '/style') );
// app.use( express.static(assetFolder + '/src') );
app.use(bodyParser.json());
app.use(morgan('dev'));

//ROUTERS
app.use("/api", APIRouter);
app.use("/", MainRouter); 
app.use("/toy-problems", TPRouter);
app.use("/blog", BlogRouter);
app.use("/portfolio", ProjectsRouter);
app.use(function(req, res) {
  res.status(404).render('404');
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('case sensitive routing', false); 

//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.disable('x-powered-by');
app.param('id', function(req, res, next, id) {
  req.params.id = Number(id);
  next();
});

//ERROR HANDLING FOR RESPONSE CODES OTHER THAN 200
app.get('/error', function(err, req, res, next) {
  //set status to 500 and render error page
  // console.error(err.message);
  res.status(500).render('500');
});

app.use(function(err, req, res, next) {
    // console.error(err.stack);
    res.status(500).render('500');
});

app.listen(app.get('port'), function(){
  console.log('Node app is running on port:' , app.get('port'));
});

module.exports = app;  




