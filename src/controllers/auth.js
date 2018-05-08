import User from '../models/users'
import {passwordGen, usertokenGen, jwtverify} from '../libs/faker'
import {validateSetupPost} from '../libs/validate'

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
        res.status(401).send('Unauthorized')
    } else {
        var token = JSON.stringify(req.headers.authorization).replace('Bearer ','')
            
            jwtverify(token, req, res)
            next()
            
            
    }
    
}

exports.tokenUser = function (req, res, next) {
    
    if (!req.headers.authorization) {
        res.status(401).send('Unauthorized')
    } else {
        var token = JSON.stringify(req.headers.authorization).replace('Bearer ','')
            
            jwtverify(token, req, res)
            
            
    }
    
}

//TODO
//add admin to db via post request -- DONE

//add user to db via post request --DONE

//create token with everything encoded --DONE

//function that decodes jwt and checks if user is an admin

//function for every request to protect the routes

//if not than send him 403 to routes that has admin rights