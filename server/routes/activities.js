var express = require('express'),
    router = express.Router(),
    passport = require('passport');

var  Activity = require('../models/activity.js');

router.get('/', function(req, res) {
  Activity.find(function(err, docs){
    if (err) throw err;
    res.send(docs);
  });
});

router.post('/', function(req, res) {
    new Activity(req.body).save(function(err, doc) {
    res.redirect('/');
  })
});

module.exports = router;
