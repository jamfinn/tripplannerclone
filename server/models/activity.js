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
  link: String,
  image: String,
  access: String,
  facebookShare: String,
  twitterShare: String,
  pinterestShare: String,
  viewpoint: Boolean,
  shop: Boolean,
  learn: Boolean,
  nearby: Boolean,
  active: Boolean,
  hike: Boolean,
  backpack: Boolean,
  mule: Boolean,
  air: Boolean,
  raft: Boolean,
  bike: Boolean,
  yes: String
}, { collection: 'activities'});

module.exports = mongoose.model('activities', Activity); // compile Activity schema to a model called activities
