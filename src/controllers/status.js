import Status from '../models/status'
import Sales from '../models/conversion'

const log = require('../libs/log')(module);

var date = new Date();

exports.postStatus = function (req, res) {
    
    var status = new Status({
      status:          req.body.status, //required
      number:          req.body.number, //required
      client:          req.body.client, //required
      base:            req.body.base,   //required
      time:            req.body.time,
      age:             req.body.age,
      appointment:     req.body.appointment,
      month:           date,
      close:           req.body.close,
      operator:        req.body.operator,
      comment:         req.body.comment,
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


  exports.showStatus = function (req, res) {

    var status = req.query.status

    try{

        Status.count({status : status}, function(err, count){
          return res.json({status: count})
      })
    } catch(error){

      return res.status(403).send("Error")
    
    }

  }

  exports.moreStatus = function (req, res) {

    var status = req.query.status

    try {
            Status.find({status: status}, (err, statuses) =>{  
              
              return res.status(200).send(statuses);

          });
    } 
    
    catch(error){

      return res.status(500).send(error)
    
    }

  }

  exports.orders = function (req, res){
    
    var sales = new Sales({
      shift: req.body.shift,
      project: req.body.project,
      date: date,
      operator: req.body.operator,
      status: req.body.status
    })
    
    sales.save(function (err) {
      if (!err) {
          log.debug("sales added to collection")
          return res.json({ status: 'OK', sales: sales});

      } else {

          log.error("INTERNAL ERROR AT sales.save");
          return res.status(500).send('Internal Server Error');
        }
      });
  }

  exports.getSales = function(req, res){
          try{
                Sales.count({total: 1}, function(err, c) {
                  return res.json({appointments: c});
                });


          } catch(error){
            return res.status(500).send('Internal Server Error');
            log.error(error)
          }
  }

  exports.getConversion = function(req, res){
          try{
          
            Sales.count({status: 'positive'}, function(err, positive_deal){
              Sales.count({status: 'negative'}, function(err, negative_deal){
                    var conversion = positive_deal / (positive_deal + negative_deal) * 100
                  res.json({conversion: conversion})             
              })
            })

      } catch(error){

            log.error('Internal Server Error');
            return res.status(500).send('Internal Server Error');
      }  
  }

  exports.monthConversion = function(req, res){

    var month = req.query.month

    try 
      {
        Sales.count({status: 'positive', date: month}, function(err, positive_deal){
          Sales.count({status: 'negative', date: month}, function(err, negative_deal){
                var conversion = positive_deal / (positive_deal + negative_deal) * 100
              res.json({conversion: conversion})             
          })
        })
      } 
    
    catch(error) 
      {
        return res.status(403).send('Error');
        log.error(error)
      }
  }

  exports.salary = function(req, res){
    
  }