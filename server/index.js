var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var Promise         = require('bluebird');
var morgan          = require('morgan');
var config          = require('./config/config');
var exphbs          = require('express-handlebars');
var APIRouter       = require('./routes/APIRouter.js');
var BlogRouter      = require('./routes/blogRouter.js');
var TPRouter        = require('./routes/TPRouter.js');
var ProjectsRouter  = require('./routes/ProjectsRouter.js');
var path            = require('path');
//for production put in NODE_ENV=production node index.js
// Set up Handlebars engine
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: require('./helpers.js').helpers,
  partialsDir: path.join(__dirname + '/views/partials/'),
  layoutsDir: path.join(__dirname + '/views/layouts/')
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.enable('view cache');
app.disable('x-powered-by');
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('case sensitive routing', false); 

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev',{
  // only log error responses 
  skip: function (req, res) { return res.statusCode < 400; }
}));
// SERVE UP THOSE DELICIOUS STATIC FILES!
app.use( express.static(__dirname + '/../public') );

//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.param('id', function(req, res, next, id) {
  req.params.id = Number(id);
  next();
});

//ROUTERS
app.use("/api", APIRouter);
app.use("/toy-problems", TPRouter);
app.use("/blog", BlogRouter);
app.use("/portfolio", ProjectsRouter);

//HOME PAGE ROUTING
app.get('/', function(req, res){
  res.render('home');
});

//RESUME PAGE ROUTING
app.get('/resume', function(req, res) {
  res.render('resume');
});
//ERROR HANDLING FOR RESPONSE CODES OTHER THAN 200
app.use(function(err, req, res, next) {
    console.log('Error : ' + err.message);
    next();
});

app.use(function(req, res) {
  res.type('text/html');
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  //set status to 500 and render error page
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


//ESTABLISH CONNECTION WITH LISTEN
app.set( 'port', (process.env.PORT || 8000) );
app.listen(app.get('port'), function(){
  console.log('Interloper Site built with Node/Express/Handlebars/jQuery is running on port:' , app.get('port'));
});

module.exports = app;  




