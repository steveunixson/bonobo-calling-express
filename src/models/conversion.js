const mongoose = require('mongoose');
const config = require('../config/mongodb');
const log = require('../libs/log')(module);
mongoose.connect(config.database);

var Schema = mongoose.Schema;

var Sales = new Schema({

      shift: {type: Number},

      total: {type: Number,default:1},

      project: {type: String},

      date: {
          type: Date
      },
      operator: {
          type: String
      },
      status: String
});



var SalesModel = mongoose.model('Sales', Sales)

module.exports = SalesModel;