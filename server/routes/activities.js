var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    Activity = require('../models/activity.js');

router.post('/activities/new', function(req, res) {
    console.log('hello from /actiities/new route', req.body);
    activities.insert(new Activity(req.body)).then(function (doc) {
    res.redirect('/')
  })
});

module.exports = router;
