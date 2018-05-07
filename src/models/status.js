const mongoose = require('mongoose');
const config = require('../config/mongodb');
const log = require('../libs/log')(module);
mongoose.connect(config.database);

var Schema = mongoose.Schema;

var Status = new Schema({
    
        status: {
          type: String,
          required: true
        },

        client: {
          type: String,
          required: true
        },
        number: {type: Number,
          required: true,
          index: {unique: true}},

        appointment_time: String,
        age:              Number,
        came:             Boolean,
        month:            String,
        close:            String,
        operator:         String,
        comment:          String
});
  
var StatusModel = mongoose.model('Status', Status);

module.exports = StatusModel;