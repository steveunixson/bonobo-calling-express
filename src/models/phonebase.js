const mongoose = require('mongoose');
const config = require('../config/mongodb');
const log = require('../libs/log')(module);
mongoose.connect(config.database);

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

// Define our beer schema
var MatchSchema = new mongoose.Schema({
  name: String,
  type: String,
  comment: String
});

// Export the Mongoose model
module.exports = mongoose.model('Match', MatchSchema);