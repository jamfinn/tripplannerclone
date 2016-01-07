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

// router.post('/getActivity', function(req, res) { added by AA
//   console.log('reqbody', req.body);
//   console.log('req params', req.params);
//   Activity.findOne({_id: req.body._id}, function(err, doc){
//     console.log('doc in get activity', doc);
//     if (err) throw err;
//     res.json(doc);
//   });
// });

router.post('/', function(req, res) {
    new Activity(req.body).save(function(err, doc) {
    res.redirect('/');
  })
});

module.exports = router;
