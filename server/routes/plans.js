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
      console.log('found a plan', doc);
      // if no plan for that user, add
      if (!doc) {
        var plan = [req.body.activity]
        console.log('no plan found for this user');
        new Plan({user: req.body.user, plan: plan}).save(function(err, doc) {
        res.send(doc);
        })
      } // if not already in plan
      else if (doc.plan.indexOf(req.body.activity) === -1) {
        doc.plan.push(req.body.activity)
        Plan.update(doc, function (){
          res.send(doc)
        })
      } else { // already in plan
        res.send(doc)
      }
  });
});

router.get('/:id', function(req, res) {
  console.log('get plan!', req.params.id);
  Plan.findOne({user: req.params.id}, function(err, doc){
    if (err) throw err;
    console.log('does this user have a plan?', doc)
    res.send(doc);
  });
});

router.post('/:id', function(req, res) {
  console.log('delete plan!', req.body);
  //findOne plan with the user_id of user, return Plan.plan array
  Plan.findOne({user: req.params.id}, function(err, doc){
    if (err) throw err;
    var index = doc.plan.indexOf(req.body.activity)
    console.log('index', index);
    doc.plan.splice(index, 1)
    Plan.update({user: req.params.id}, doc, function (err, doc) {
      console.log(doc.plan);
      res.send(doc);
    })
  });
});


module.exports = router;
