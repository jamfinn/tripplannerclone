// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Activity = new Schema({
  title: String,
  description: String,
  duration: String,
  image: String,
  rim: String,
  location: String,
  category: String,
  age: String,
  accessibility: String,
  cost: String,
  hours: String,
  fitness: String,
  reserve: String
});

// mongoose.model('activities', Activity); // link to a collection called activities

// User.plugin(passportLocalMongoose);

// mongoose.connect('mongodb://' + process.env.MONGOLAB_URI);

module.exports = mongoose.model('activities', Activity);
