// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');


var Activity = new Schema({
  title: String,
  description: String,
  duration: String
});

// User.plugin(passportLocalMongoose);
//
module.exports = mongoose.model('activities', Activity);
