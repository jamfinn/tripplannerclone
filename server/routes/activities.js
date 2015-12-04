var express = require('express'),
    router = express.Router(),
    passport = require('passport');

var  Activity = require('../models/activity.js');

router.get('/', function(req, res) {
  console.log('get!');
  Activity.find(function(err, docs){
    if (err) throw err;
    console.log(docs)
    res.send(docs);
  });
});

router.post('/', function(req, res) {
    console.log('from /activities post', req.body);
    new Activity(req.body).save(function(err, doc) {
    console.log(doc)
    res.redirect('/');
  })
});

module.exports = router;
