require('dotenv').config()

import faker from 'faker'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/mongodb'
import jwt_decode from 'jwt-decode'
import mongoose from 'mongoose'
import User from '../models/users'
import {isAdmin} from '../controllers/auth'

const log = require('../libs/log')(module);

const saltRounds = process.env.SRV_SALT;

function passwordGen() {
    return faker.internet.password();
}

function usertokenGen(name, password, role) {
    return jwt.sign({ name: name, password: password, role: role }, config.secret);
}

function bcryptGen(req, res){

    var salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(organization, salt);

}

function jwtverify (token, req, res) {
    

    var decoded = jwt_decode(token);
    var name = decoded.name;
    var password = decoded.password;
    var role = decoded.role;

    
    var query = User.findOne({ name: new RegExp(name, 'i') });
    query.select('name password role');
    query.exec(function (err, user) {

        if (err) return handleError(err);

        if (user.password === password && user.name === name && user.role === 'admin') {
            
            log.info('Acsess granted! Welcome: ' + user.name)

        } else {
            
            return res.status(403).send('Forbiden');
            
        }
   
});

}



  module.exports.passwordGen = passwordGen;
  module.exports.bcryptGen = bcryptGen;
  module.exports.usertokenGen = usertokenGen;
  module.exports.jwtverify = jwtverify;
  

  //objects
    //user.name === name from db
    //user.password === password from db
    //user.role === role from db
    //decoded.name === name decoded from token
    //decoded.password === password decoded from token
    //decoded.role === role decoded from token