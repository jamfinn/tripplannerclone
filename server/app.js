// dependencies

require('dotenv').load();

var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    hash = require('bcrypt-nodejs'),
    path = require('path'),
    passport = require('passport'),
    config = require('./oauth.js'),
    localStrategy = require('passport-local' ).Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google').Strategy;


// mongoose
mongoose.connect(process.env.MONGOLAB_URI);

// user schema/model
var User = require('./models/user.js');

// create instance of express
var app = express();

// require routes
var routes = require('./routes/api.js');

// define middleware
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.methodOverride());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// serialize and deserialize
passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new FacebookStrategy({
 clientID: config.facebook.clientID,
 clientSecret: config.facebook.clientSecret,
 callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

// routes
app.use('/user/', routes);

app.get('/', routes.index);
app.get('/ping', routes.ping);
app.get('/', ensureAuthenticated, function(req, res){
res.render('../client.partials.home', { user: req.user });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
  // res.render('login', { user: req.user });
});

app.get('/auth/facebook',
passport.authenticate('facebook'),
function(req, res){
});
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
 res.redirect('/');
});
app.get('/logout', function(req, res){
req.logout();
res.redirect('/');
});

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}

// error handlers
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
