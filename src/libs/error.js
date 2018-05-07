var express         = require('express');
var log             = require('../libs/log')(module);
var error           = express.Router();
    //------error handler
error.use(function(req, res, next){
    res.status(404);
    log.error('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
  });
  
  error.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
  });
  
  error.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
  });
  module.exports = error;
