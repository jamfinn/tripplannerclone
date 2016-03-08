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
    // auth = require('./authentication.js');

    config = require('./oauth.js'),
    localStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google').Strategy;


// mongoose
mongoose.connect('mongodb://' + process.env.MONGOLAB_URI);

// user schema/model
var User = require('./models/user.js'); // need this, because used later in app.js

// create instance of express
var app = express();

// require routes
var users = require('./routes/api.js');
var activities = require('./routes/activities.js')
var plans = require('./routes/plans.js')

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.methodOverride());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
console.log('cat is dancing');

// configure passport
// passport.use(new localStrategy(User.authenticate()));//try User.createStrategy()
passport.use(User.createStrategy());//try User.createStrategy()
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

passport.use(new FacebookStrategy({
clientID: config.facebook.clientID,
clientSecret: config.facebook.clientSecret,
callbackURL: config.facebook.callbackURL,
profileFields: ['id', 'email', 'name']
},
function(accessToken, refreshToken, profile, done) {
  console.log('in FacebookStrategy and here is the profile: ', profile);
  // sessionStorage.setItem('user', profile.id)
  User.findOne({ oauthID: profile.id }, function(err, user) {
    if(err) { console.log(err); }
    if (!err && user != null) {
      console.log('oauth user found: ', user);
      done(null, user);
    } else {
      console.log('no user found, here is profile: ', profile);
      var user = new User({
        oauthID: profile.id,
        fname: profile.name.givenName,
        lname: profile.name.familyName,
        username: profile.emails[0].value
    });
    user.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("saving user ...", user);
        done(null, user);
      };
    });

  };
  });
}
));

passport.use(new TwitterStrategy({
 consumerKey: config.twitter.consumerKey,
 consumerSecret: config.twitter.consumerSecret,
 callbackURL: config.twitter.callbackURL

},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

passport.use(new GoogleStrategy({
 returnURL: config.google.returnURL,
 realm: config.google.realm
},
function(identifier, profile, done) {
 process.nextTick(function () {
   profile.identifier = identifier;
   return done(null, profile);
 });
}
));

// routes
app.use('/user', users);
app.use('/activities', activities);
app.use('/plans', plans);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
  // res.render('login', { user: req.user });
});

app.get('/auth/facebook',
passport.authenticate('facebook', { scope: [ 'email'] }),
function(req, res){
});
app.get('/auth/facebook/callback',
passport.authenticate('facebook',
  {
    failureRedirect: '/login',
    scope: [ 'email', 'public_profile' ] }),
//   function (req, res) {
//   console.log('IS THIS THE USER?', res._id);
//   res.redirect('/');
// });
function(req, res) {
  console.log('HERE IS THE RESPONSE', req.user._id);
 res.redirect('/' + req.user._id);
});
app.get('/auth/twitter',
passport.authenticate('twitter'),
function(req, res){
});
app.get('/auth/twitter/callback',
passport.authenticate('twitter', { failureRedirect: '/login' }),
function(req, res) {
 res.redirect('/');
});
app.get('/auth/google',
passport.authenticate('google'),
function(req, res){
});
app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
 res.redirect('/');
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
