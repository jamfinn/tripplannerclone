// plan model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    // passportLocalMongoose = require('passport-local-mongoose');

var Plan = new Schema({
  user: String,
  plan: []
});

// Plan.plugin(passportLocalMongoose);

module.exports = mongoose.model('plans', Plan);
