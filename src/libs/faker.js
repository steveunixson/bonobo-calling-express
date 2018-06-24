require('dotenv').config()

import faker from 'faker'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/mongodb'
import jwt_decode from 'jwt-decode'

const log = require('../libs/log')(module);

const saltRounds = process.env.SRV_SALT;

function passwordGen() {
    return faker.internet.password();
}

function usertokenGen(name, password, role) {
    return jwt.sign({ name: name, password: password, role: role}, config.secret);
}

function bcryptGen(req, res){

    var salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(organization, salt);

}

  module.exports.passwordGen = passwordGen;
  module.exports.bcryptGen = bcryptGen;
  module.exports.usertokenGen = usertokenGen;
  

  //objects
    //user.name === name from db
    //user.password === password from db
    //user.role === role from db
    //decoded.name === name decoded from token
    //decoded.password === password decoded from token
    //decoded.role === role decoded from token