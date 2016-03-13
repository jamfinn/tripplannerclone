// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  //
  local: {
    fname: String,
    lname: String,
    email: String,
    password: String
  },
  // facebook: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   fname: String,
  //   lname: String
  // },
  twitter: {
    id: String,
    token: String,
    username: String,
    fname: String,
    lname: String
  },
  // google: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   fname: String,
  //   lname: String
  // }

  facebook: {
    oauthID: Number,
    username: String, // this is email
    password: String,
    fname: String,
    lname: String
  }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);
