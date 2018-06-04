const Match = require('../models/phonebase');
const xlsxj = require("xlsx-to-json");
const log = require('../libs/log')(module);
var JSONStream = require('JSONStream');
var fs = require('fs');
var path = require('path');
const mongoose = require('mongoose')
 
// init stream 
 
var SaveToMongo = require('save-to-mongo');


const config = require('../config/mongodb');
const jsonfile = "tmp/data.json"
const xlsxfile = "tmp/base.xlsx"



exports.postUpload = function(req, res){
  
  if (!req.files.xlsx)
    return res.status(400).send('No files were uploaded.');

  if (!req.body.name)
    return res.status(400).send('No name was specified.');
  
  if (!req.body.type)
    return res.status(400).send('No type was specified.');
  
  if (!req.body.comment)
    return res.status(400).send('No comment was specified.');
   
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
var match = new Match({
  name: req.body.name,
  type: req.body.type,
  comment: req.body.comment
});
match.save(function (err) {
  if (!err) {
      log.info("match created");
      return res.send({ status: 'OK', match:match });
  } else {
      console.log(err);
      if(err.name == 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
      } else {
          res.statusCode = 500;
          res.send({ error: 'Server error' });
      }
      log.error('Internal error(%d): %s',res.statusCode,err.message);
    }
  });

  let sampleFile = req.files.xlsx; 
  
  sampleFile.mv(xlsxfile, function(err) {
    if (err)
      return res.status(500).send(err);
    log.debug('file recived')
    if (fs.existsSync(jsonfile)) {
      bulkSave(); 
      console.log('file found and saved!')
    } else {

      xlsxj({
        input: xlsxfile, 
        output: jsonfile
      }, function(err, result) {
        if(err) {
          log.error(err);
        } else {
          log.debug('created json file!');
          bulkSave();
        }
      });
    
    }
  });

  function bulkSave() {
    var saveToMongo = SaveToMongo({
      uri: config.database,
      collection: req.body.name,
      bulk: {
        mode: 'unordered'
      }
    });
     
    // go go power rangers!!
     
    fs.createReadStream(path.join(jsonfile))
      .pipe(JSONStream.parse('*'))
      .pipe(saveToMongo)
      .on('execute-error', function(err) {
        log.error(err);
      })
      .on('done', function() {
        log.info('Data uploaded to DB!!!');
      });
  }
}


  exports.getUpload = function(req, res){
    Match.find(function(err, users) {
        if (err)
          res.send(err);
    
        res.json(users);
      });
  }

function find (name, query, cb) {
    mongoose.connection.db.collection(name, function (err, collection) {
       collection.find(query).toArray(cb);
   });
  }
  exports.getPhone = function (req, res) {
    if (!req.body.base)
    return res.status(400).send('No base was specified.');
  
    find(req.body.base, {_id : req.body._id}, function (err, docs) {
      return res.send(docs);
  });   
  }

  exports.getTemplate = function(req, res){

    var file = 'tmp/templates/База.xlsx'
     try
     {
      return res.download(file);
     }

     catch(error)
     {
      return res.status(500).send('Internal Error');
     }

  }

  exports.activity = function(req, res){

    var name = req.body.name
    var type = req.body.type

    try
    {
      Match.findOneAndUpdate({name: name}, {$set:{type : type}}, (err, base) => {
        return res.json({message: "Updated"})
      })
    }
    catch(error)
    {
      return res.status(500).send('Internal Error')
    }
  }