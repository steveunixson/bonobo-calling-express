require('dotenv').config()

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var salt = process.env.SRV_SALT

var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    domain: {
      type: String
    }
});

UserSchema.pre('save', function() {
  var user = this;
      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash){
        if (err) { console.log(err); } else {
          next()
        }
      })

});

  UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };
  
  // Export the Mongoose model

module.exports = mongoose.model('User', UserSchema);
