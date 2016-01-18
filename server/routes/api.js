var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    User = require('../models/user.js');

router.get('/', function (req, res) {
  console.log('req.body', req.body);
  User.findOne({username: req.body.username}, function (err, doc) {
    console.log('doc', doc);
    if (err) {
      // console.log(err);
      return res.status(500).json({err: err})
    }
    return res.status(200).json(doc)
  })
})

router.post('/register', function(req, res, next) {
  console.log('hello from /register route', req.body.userInfo);
  var user = req.body
  User.register(new User({username: user.username, fname: user.fname, lname: user.lname}), user.password, function(err, account) {
    console.log('account parameter from User.register ', account);
    if (err) {
      console.log('error in passport register', err);
      return res.status(500).json({err: err})
    }
    passport.authenticate('local')(req, res, function () {
    //   console.log('in authenticate');
      req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).json({status: 'Login successful!', user_id: account._id})
      });
    });
  })
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    console.log('first user variable in login: ', user);
    if (err) { return next(err) }
    if (!user) {
      return res.status(401).json({err: info})
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({err: 'Could not log in user'})
      }
      res.status(200).json({status: 'Login successful!', user_id: user._id})
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'Bye!'})
});

module.exports = router;
