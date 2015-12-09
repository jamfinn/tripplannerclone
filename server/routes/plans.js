var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    Plan = require('../models/plan.js');

router.get('/:id', function(req, res) {
  console.log('get plan!', req.body);
  //findOne plan with the user_id of user, return Plan.plan array
  Plan.findOne({user_id: req.user_id}, function(err, doc){
  //   if (err) throw err;
    console.log(doc)
  //   res.send(doc);
  });
});

router.post('/', function(req, res) {
    console.log('from /plan post', req.body);
    // findOne plan with user_id of user
    Plan.findOne({user_id: req.user_id}, function(err, doc){
    //   if (err) throw err;
      console.log(doc)
    //   res.send(doc);
  });
    //if no plan, make a plan and add activity
    //if plan, push activity to Plan.plan array
  //   Plan.findOne({})
  //   new Activity(req.body).save(function(err, doc) {
  //   console.log(doc)
  //   res.redirect('/');
  // })
});

module.exports = router;
