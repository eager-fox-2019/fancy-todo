'use strict';
const { generateHash } = require('../helpers/hashHelpers')

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  full_name: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [{
      validator: function(value) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;        
        return re.test(value.toLowerCase())
      },
      message: props => `${props.value} is not a valid email` 
    }]
  },
});

userSchema.pre('save', function(next) {
  this.password = generateHash(this.password)
  next();
});

var User = mongoose.model('User', userSchema);

module.exports = User