const mongoose = require('mongoose');
const config = require('../config/mongodb');
const log = require('../libs/log')(module);

var Schema = mongoose.Schema;

var Salary = new Schema({
    
    intern: Number,
    operator: Number,
    demo : Number,
    vite : Number,
    apikey: String
        
});

var SalaryModel = mongoose.model('Salary', Salary);

module.exports = SalaryModel;