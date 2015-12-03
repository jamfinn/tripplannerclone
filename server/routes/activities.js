var express = require('express'),
    router = express.Router(),
    passport = require('passport');

var mongoose = require('mongoose');
// var Activity = mongoose.model('activities');

var  Activity = require('../models/activity.js');



router.get('/', function(req, res) {
    console.log('hello from /actities route', req.body);
    // activities.insert(new Activity(req.body)).then(function (doc) {
    res.send({ activity: 'My funky activity' });
  // })
});

router.post('/', function(req, res) {
    console.log('from /activities post', req.body);
    new Activity(req.body).save(function(err, doc) {
    console.log(doc)
    res.redirect('/');
  })
});

module.exports = router;
