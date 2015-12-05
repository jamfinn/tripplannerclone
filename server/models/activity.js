// activity model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Activity = new Schema({
  title: String,
  description: String,
  duration: String,
  image: String,
  rim: String,
  location: String,
  museum: Boolean,
  shopping: Boolean,
  age: String,
  access: String,
  cost: String,
  hours: String,
  fitness: String,
  reserve: String
}, { collection: 'activities'});

module.exports = mongoose.model('activities', Activity); // compile Activity schema to a model called activities
