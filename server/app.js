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
    auth = require('./authentication.js');

    config = require('./oauth.js'),
    localStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google').Strategy;


// mongoose
mongoose.connect('mongodb://' + process.env.MONGOLAB_URI);

// user schema/model
var User = require('./models/user.js');//need this, because used later in app.js

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
console.log('after keyboard cat');
app.use(passport.initialize());
app.use(passport.session());

// configure passport
// passport.use(new localStrategy(User.authenticate()));//try User.createStrategy()
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// passport.use(new FacebookStrategy({
// clientID: config.facebook.clientID,
// clientSecret: config.facebook.clientSecret,
// callbackURL: config.facebook.callbackURL
// },
// function(accessToken, refreshToken, profile, done) {
//   User.findOne({ oauthID: profile.id }, function(err, user) {
//   if(err) { console.log(err); }
//   if (!err && user != null) {
//     done(null, user);
//   } else {
//     console.log('facebook user profile', profile);
//     var user = new User({
//       oauthID: profile.id,
//       name: profile.displayName,
//       created: Date.now()
//     });
//     user.save(function(err) {
//       if(err) {
//         console.log(err);
//       } else {
//         console.log("saving user ...");
//         done(null, user);
//       };
//     });
//   };
//   });
// }
// ));
//
// passport.use(new TwitterStrategy({
//  consumerKey: config.twitter.consumerKey,
//  consumerSecret: config.twitter.consumerSecret,
//  callbackURL: config.twitter.callbackURL
// },
// function(accessToken, refreshToken, profile, done) {
//  process.nextTick(function () {
//    return done(null, profile);
//  });
// }
// ));
//
// passport.use(new GoogleStrategy({
//  returnURL: config.google.returnURL,
//  realm: config.google.realm
// },
// function(identifier, profile, done) {
//  process.nextTick(function () {
//    profile.identifier = identifier;
//    return done(null, profile);
//  });
// }
// ));

// serialize and deserialize
passport.serializeUser(function(user, done) {
 console.log('serializeUser: ' + user._id)
 done(null, user._id);
});
passport.deserializeUser(function(id, done) {
 User.findById(id, function(err, user){
     console.log(user)
     if(!err) done(null, user);
     else done(err, null)
 })
});

// routes
app.use('/user/', users);
app.use('/activities/', activities);
app.use('/plans/', plans)

// app.get('/', routes.index);
// app.get('/ping', routes.ping);
app.get('/plan', ensureAuthenticated, function(req, res){
  User.findById(req.session.passport.user, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      res.status(200).json({status: 'Find the plan!'});
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
 res.redirect('/plan');
});
app.get('/auth/twitter',
passport.authenticate('twitter'),
function(req, res){
});
app.get('/auth/twitter/callback',
passport.authenticate('twitter', { failureRedirect: '/login' }),
function(req, res) {
 res.redirect('/plan');
});
app.get('/auth/google',
passport.authenticate('google'),
function(req, res){
});
app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
 res.redirect('/plan');
});
// app.get('/logout', function(req, res){//this is redundant with routes/api.js
// req.logout();
// res.redirect('/');
// });

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
