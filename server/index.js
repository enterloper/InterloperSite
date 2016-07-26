var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var _               = require('lodash');
var path            = require('path'); 
var morgan          = require('morgan');
var config          = require('./config/config');
var Posts           = require('./posts/posts_model');
var ToyProbs        = require('./toy_problems/toy_problems_model');
var Projects        = require('./projects/projects_model');
var db              = require('./db');
var Handlebars      = require('handlebars');
var exphbs          = require('express-handlebars');
var BlogRouter      = require('./routes/blogRouter');
var TPRouter        = require('./routes/TPRouter');
var ProjectsRouter  = require('./routes/ProjectsRouter');
var APIRouter       = require('./routes/APIRouter');
var MainRouter      = require('./routes/mainRouter');
var Promise         = require('bluebird');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//assetFolder for path to public directory => Interloper/public
var assetFolder = path.resolve(__dirname, './../../public');
app.use( express.static(assetFolder) );
app.use( express.static(assetFolder + '/img') );
app.use( express.static(assetFolder + '/style') );
app.use( express.static(assetFolder + '/src') );
//serve static files in public directory, without processing them.
app.use(express.static('public'));
//middleware
// app.use(morgan('dev'));
app.set('views', __dirname + '/views');


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
    'server/views/partials/'
  ],
  layoutsDir: 'server/views/layouts/'
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('view cache', true);
app.set('case sensitive routing', false); 
//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.disable('x-powered-by');
app.param('id', function(req, res, next, id) {
  req.params.id = Number(id);
  next();
});

//ROUTERS
app.use("/api", APIRouter);
app.use("/", MainRouter); 
app.use("/toy-problems", TPRouter);
app.use("/blog", BlogRouter);
app.use("/portfolio", ProjectsRouter);
app.use(function(req, res) {
  res.status(404).render('404');
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

app.listen(config.port || 3000, function(){
  // console.log('Listening on port:' , config.port);
});

module.exports = app;  




