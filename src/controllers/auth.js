import User from '../models/users'
import {passwordGen, usertokenGen, jwtverify, jwtverifyUser} from '../libs/faker'
import {validateSetupPost} from '../libs/validate'


import faker from 'faker'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/mongodb'
import jwt_decode from 'jwt-decode'
import mongoose from 'mongoose'

const log = require('../libs/log')(module);

exports.setupPost = function (req, res) {

    var name = req.body.username;
    var role = 'admin';
    var password = passwordGen()

    var user = new User({ 
        name: req.body.username, 
        password: password,
        organization: req.body.organization,
        role: "admin",
        token: usertokenGen(name, password, role)
      });
    
      // save the sample user
      user.save(function(err) {

        if (err) {
            validateSetupPost(req, res)
        } else {
            log.info('User saved successfully');
            res.json({success: true, token: user.token});
        }
        
    });        
}

exports.setupUserPost = function (req, res) {
    
    var name = req.body.username;
    var role = 'user';
    var password = req.body.password

    var user = new User({ 
        name: req.body.username, 
        password: req.body.password,
        organization: req.body.organization,
        role: "user",
        token: usertokenGen(name, password, role)
      });
    
      // save the sample user
      user.save(function(err) {

        if (err) {
            validateSetupPost(req, res)
        } else {
            log.info('User saved successfully');
            return res.json({success: true, token: user.token});
        }
        
    });        
}

exports.token = function (req, res, next) {

    if (!req.headers.authorization) {
        log.error('UNAUTHORIZED USER HAS BEEN SPOTED!')
        res.status(401).send('Unauthorized')
    } else {
        var token = JSON.stringify(req.headers.authorization).replace('Bearer ','')
        
            try {
                var decoded = jwt_decode(token);
            } catch(error){

                log.error('USER HAS INVALID TOKEN! BAD USER!')
                return res.status(500).send('Internal Server Error');
            
            }
            var name = decoded.name;
            var password = decoded.password;
            var role = decoded.role;
        
                var query = User.findOne({ name: new RegExp(name, 'i') });
            query.select('name password role');
            try {
                query.exec(function (err, user) {
        
                    if (user.password === password && user.name === name && user.role === 'admin') {
                        
                        log.info('Acsess granted for: ' + user.name)
                        next()
                        
            
                    } else  {
                        log.error('user ' + user.name + ' Permission denied')
                        return res.status(403).send('Forbidden')
                    }
               
            });
            } catch(err){
                return res.status(500).send('Internal Server Error');
            }

        
        
    }

    
}

exports.tokenUser = function (req, res, next) {
    
    if (!req.headers.authorization) {
        log.error('UNAUTHORIZED USER HAS BEEN SPOTED!')
        res.status(401).send('Unauthorized')
    } else {
        var token = JSON.stringify(req.headers.authorization).replace('Bearer ','')
        
            try {
                var decoded = jwt_decode(token);
            } catch(error){

                log.error('USER HAS INVALID TOKEN! BAD USER!')
                return res.status(500).send('Internal Server Error');
            
            }
            var name = decoded.name;
            var password = decoded.password;
            var role = decoded.role;
        
                var query = User.findOne({ name: new RegExp(name, 'i') });
            query.select('name password role');
            try {
                query.exec(function (err, user) {
        
                    if (user.password === password && user.name === name && user.role === 'user') {
                        
                        log.info('Acsess granted for: ' + user.name)
                        next()
                        
            
                    } else  {
                        log.error('user ' + user.name + ' Permission denied')
                        return res.status(403).send('Forbidden')
                    }
               
            });
            } catch(err){
                return res.status(500).send('Internal Server Error');
            }

    }
    
}



exports.loginUser = function (req, res) {
    var password = req.body.password
    var username = req.body.username
    try {
        if (typeof(password) == 'undefined' || typeof(username) == 'undefined') {
            throw error
        }
      }
      catch(error) {
        return res.status(403).send('Bad Request');
      }

      var query = User.findOne({ name: new RegExp(username, 'i') });
      
      query.select('name password token');
      query.exec(function (err, user) {
  
          if (err) return log.error(err);

          try {
            if (username !== user.name || password !== user.password) {
                throw error
            }
          }
          catch(error) {
            return res.status(403).send('Bad Request');
          }
          
          log.info('A user has been logged in! Welcome: ' + user.name)

          res.json(
            { 
              welcome: user.name,
              token: user.token
            }
        )
    });
}
