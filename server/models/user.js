// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  oauthID: Number,
  username: String,
  password: String,
  fname: String,
  lname: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);
