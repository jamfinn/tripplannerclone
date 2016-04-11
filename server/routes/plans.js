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
    // findOne plan with user_id of user
    Plan.findOne({user: req.body.user}, function(err, doc){
      if (err) throw err;
      // if no plan for that user, add
      if (!doc) {
        var plan = [req.body.activity]
        new Plan({user: req.body.user, plan: plan}).save(function(err, doc) {
        res.send(doc);
        })
      } // if not already in plan
      else if (doc.plan.indexOf(req.body.activity) === -1) {
        doc.plan.push(req.body.activity)
        Plan.update({user: req.body.user}, {plan: doc.plan}, function (){
          res.send(doc)
        })
      } else { // already in plan
        res.send(doc)
      }
  });
});

router.get('/:id', function(req, res) {
  Plan.findOne({user: req.params.id}, function(err, doc){
    if (err) throw err;
    res.send(doc);
  });
});

router.post('/:id', function(req, res) {
  //findOne plan with the user_id of user, return Plan.plan array
  Plan.findOne({user: req.params.id}, function(err, doc){
    if (err) throw err;
    var index = doc.plan.indexOf(req.body.activity)
    doc.plan.splice(index, 1)
    Plan.update({user: req.params.id}, {plan: doc.plan}, function (err, doc) {
      res.send(doc);
    })
  });
});

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/login')
}

module.exports = router;
