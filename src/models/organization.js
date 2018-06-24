const mongoose = require('mongoose');
const config = require('../config/mongodb');
const log = require('../libs/log')(module);
mongoose.connect(config.database)

var Schema = mongoose.Schema;

var Organization = new Schema({
    
    ip:             Number,
    apikey:         String,
    uuid  :         String,
    domain :        String,
    organization:   String,
    uri :           String
        
});

var OrganizationModel = mongoose.model('Organization', Organization);

module.exports = OrganizationModel;