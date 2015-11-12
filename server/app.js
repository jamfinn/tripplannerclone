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
    config = require('../oauth.js'),
    localStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google').Strategy;


// mongoose
mongoose.connect('mongodb://' + process.env.MONGOLAB_URI);

// user schema/model
var User = require('./models/user.js');

// create instance of express
var app = express();

// require routes
var routes = require('./routes/api.js');
var activities = require('./routes/activities.js')

// define middleware
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.methodOverride());
app.use(require('express-session')({//try substituting expressSession
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
console.log('after keyboard cat');
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));

// serialize and deserialize
passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});

// configure passport
passport.use(new localStrategy(User.authenticate()));//try User.createStrategy()
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
app.use('/activities/', activities);

// app.get('/', routes.index);
// app.get('/ping', routes.ping);
app.get('/', ensureAuthenticated, function(req, res){
  User.findById(req.session.passport.user, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      res.render('account', { user: user});
    }
  })
})

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '../client', 'index.html'));
//   // res.render('login', { user: req.user });
// });

app.get('/auth/facebook',
passport.authenticate('facebook'),
function(req, res){
});
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
 res.redirect('/');
});
app.get('/logout', function(req, res){//this is redundant with routes/api.js
req.logout();
res.redirect('/login');
});

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/login')
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
