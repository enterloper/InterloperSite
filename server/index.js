var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var Promise         = require('bluebird');
var path            = require('path'); 
var morgan          = require('morgan');
var config          = require('./config/config');
var Handlebars      = require('handlebars');
var exphbs          = require('express-handlebars');
var APIRouter       = require('./routes/APIRouter.js');
var BlogRouter      = require('./routes/blogRouter.js');
var TPRouter        = require('./routes/TPRouter.js');
var ProjectsRouter  = require('./routes/ProjectsRouter.js');

//for production put in NODE_ENV=production node index.js
// Set up Handlebars engine
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: require('./helpers.js').helpers,
  partialsDir: 'server/views/partials/',
  layoutsDir: 'server/views/layouts/'
});
// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('case sensitive routing', false); 

//middleware
app.use(bodyParser.json());
app.use(morgan('dev',{
  // only log error responses 
  skip: function (req, res) { return res.statusCode < 400; }
}));
// SERVE UP THOSE DELICIOUS STATIC FILES!
app.use( express.static('public') );
// app.use('/img', express.static(__dirname+ '/../public/img') );
// app.use('/lib', express.static(__dirname+ '/../public/lib') );



//DISABLE RETURNING SERVER INFORMATION VIA Express' default X-Powered-By
app.disable('x-powered-by');
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

//ERROR HANDLING FOR RESPONSE CODES OTHER THAN 200
app.use(function(req, res) {
  res.status(404).render('404');
});

app.get('/error', function(err, req, res, next) {
  //set status to 500 and render error page
  console.error(err.stack);
  res.status(500).render('500');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500');
});

//ESTABLISH CONNECTION WITH LISTEN
app.set( 'port', (process.env.PORT || 8000) );
app.listen(app.get('port'), function(){
  console.log('Node app is running on port:' , app.get('port'));
});

module.exports = app;  




