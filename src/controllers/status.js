import Status from '../models/status'

const log = require('../libs/log')(module);

var date = new Date();

exports.postStatus = function (req, res) {
    
    var status = new Status({
      status:   req.body.status, //required
      number:   req.body.number, //required
      client:   req.body.client, //required
      base:     req.body.base,   //required
      time:     req.body.time,
      age:      req.body.age,
      came:     req.body.came,
      month:    date.getMonth(),
      close:    req.body.close,
      operator: req.body.operator,
      comment:  req.body.comment 
    });

    status.save(function (err) {
      if (!err) {
          log.debug("status added to collection");
          return res.send({ status: 'OK', status:status });
      } else {
          log.error(err);
          return res.json({message: 'Internal Error'});
        }
      });
  }