var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    Plan = require('../models/plan.js');

router.get('/', function(req, res) {
  console.log('get plan!');
  //findOne plan with the user_id of user, return Plan.plan array
  // Plan.findOne({}, function(err, doc){
  //   if (err) throw err;
  //   console.log(doc)
  //   res.send(doc);
  // });
});

router.post('/', function(req, res) {
    console.log('from /plan post', req.body);
    //findOne plan with user_id of user
    //if no plan, make a plan by pushing new activity to Plan.plan array
    //if plan, push activity to Plan.plan array
  //   Plan.findOne({})
  //   new Activity(req.body).save(function(err, doc) {
  //   console.log(doc)
  //   res.redirect('/');
  // })
});

module.exports = router;
