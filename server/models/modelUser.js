'use strict';
const { generateHash } = require('../helpers/hashHelpers')

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  full_name: String,
  username: {
    type: String,
    validate: {
      validator: function(value) {
        return User.findOne({ username: value })
          .then((user) => {
            if (user) resolve(true)
          })
      },
      message: props => `${props.value} is already in our database. Please use other username`
    }
  },
  password: String,
  email: {
    type: String,
    validate: [{
      validator: function(value) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;        
        return re.test(value.toLowerCase())
      },
      message: props => `${props.value} is not a valid email` 
    },{
      validator: function(value) {
        return User.findOne({ email: value })
          .then((user) => {
            if (user) resolve(true)
          })
      },
      message: props => `${props.value} is already in our database. Please use other email`
    }]
  },
});

userSchema.pre('save', function(next) {
  this.password = generateHash(this.password)
  next();
});

var User = mongoose.model('User', userSchema);

module.exports = User