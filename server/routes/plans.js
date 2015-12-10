var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    Plan = require('../models/plan.js');

router.get('/', function(req, res) {
  Plan.find(function(err, docs){
    if (err) throw err;
    res.send(docs);
  });
});

router.post('/', function(req, res) {
    console.log('from /plans post', req.body);
    // findOne plan with user_id of user
    Plan.findOne({user: req.body.user}, function(err, doc){
      if (err) throw err;
      if (!doc) {
        var plan = [req.body.activity]
        console.log('no plan found for this user');
        new Plan({user: req.body.user, plan: plan}).save(function(err, doc) {
        res.redirect('/');
        })
      }
      else {
        if (indexOf(req.body.activity) === -1) {
          doc.plan.push(req.body.activity)
          console.log(doc);
          Plan.update(doc, function (){
            res.redirect('/')
          })
        } else {
          res.redirect('/')
        }

      //   res.send(doc);
      }
  });
    //if no plan, make a plan and add activity
    //if plan, push activity to Plan.plan array
  //   Plan.findOne({})
  //   new Activity(req.body).save(function(err, doc) {
  //   console.log(doc)
  //   res.redirect('/');
  // })
});

router.get('/:id', function(req, res) {
  console.log('get plan!', req.params.id);
  //findOne plan with the user_id of user, return Plan.plan array
  Plan.findOne({user: req.params.id}, function(err, doc){
    if (err) throw err;
    console.log('does this user have a plan?', doc)
    res.send(doc);
  });
});

module.exports = router;
