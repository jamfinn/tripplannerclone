// activity model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Activity = new Schema({
  rim: String,
  title: String,
  type: String, // activity or lodging
  hours: String,
  location: String,
  description: String,
  image: String,
  access: String,
  museum: Boolean,
  viewpoint: Boolean,
  shopping: Boolean,
  learn: Boolean,
  nearby: Boolean,
  hike: Boolean,
  backpack: Boolean,
  mule: Boolean,
  air: Boolean,
  raft: Boolean,
  bike: Boolean
}, { collection: 'activities'});

module.exports = mongoose.model('activities', Activity); // compile Activity schema to a model called activities
