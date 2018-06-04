import Status from '../models/status'
import Sales from '../models/conversion'
import Salary from '../models/salary'

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

      var salary = new Salary({

          intern : req.body.intern,
          operator : req.body.operator,
          demo : req.body.demo,
          vite : req.body.vite
      
        })

        salary.save(function (err) {
          if (!err) {
              log.debug("salary added to collection")
              return res.json({status: 'OK'});
    
          } else {
    
              log.error("INTERNAL ERROR AT sales.save");
              return res.status(500).send('Internal Server Error');

            }
          });

  }

  exports.salaryRemove = function(req, res){

   try
   {
      Salary.findOneAndRemove(req.body.intern, (err, salary) => {

         return res.json({message: "Removed"}) 

      });
   }
   catch(error)
   {
    return res.status(500).send('Internal Error')
   }

  }

  exports.salaryShow = function(req, res){

    try
    {
      Salary.find((err, salary) => {

      return res.json({salary: salary})

      })
    }

    catch(error)
    {
      return res.status(500).send('Internal Error')
      log.error(error)
    }

  }

  exports.getSalary = function(req, res){
    
        var operator = req.body.operator;
        var seconds_online = req.body.online;

    try{

      Sales.count({status: 'positive', operator: operator, project: 'demo'}, function (err, positive_deal_demo){
      
        Sales.count({status: 'positive', operator: operator, project: 'vite'}, function (err, positive_deal_vite){
      
          Salary.find({}, (err, salary) =>{
           
            var cost_demo = salary[0].demo
            var cost_vite = salary[0].vite
            var cost_intern = salary[0].intern
            var cost_operator = salary[0].operator

            salaryCount(cost_demo, cost_vite, positive_deal_demo, positive_deal_vite, cost_intern, cost_operator, seconds_online)
    
          });
    
        })
        
      })


      function salaryCount(cost_demo, cost_vite, positive_deal_demo, positive_deal_vite, cost_intern, cost_operator, seconds_online){

        var salary = cost_operator * seconds_online + cost_vite * positive_deal_vite + cost_demo * positive_deal_demo;
        return res.json({salary : salary, vite : positive_deal_vite, demo : positive_deal_demo})

      }

          
    }
    catch(error){
      return res.status(500).send('Internal Error')
      console.log(error)
    }

  }

  //Query String: ?strID=XXXX&strName=yyyy&strDate=zzzzz

  //доступ к объектам блять
  //объект[0].ключ -- выдаст значение
  //а вот какого хуя оно именно так работает одному богу известно
  //я сгорел, несите нового НЕНАВИСТЬ!!!11