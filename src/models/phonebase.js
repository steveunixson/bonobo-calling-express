const mongoose = require('mongoose');
const config = require('../config/mongodb');
const log = require('../libs/log')(module);

// Define our beer schema
var MatchSchema = new mongoose.Schema({
  name: String,
  type: String,
  comment: String,
  apikey: String
});

// Export the Mongoose model
 
module.exports = mongoose.model('Match', MatchSchema);