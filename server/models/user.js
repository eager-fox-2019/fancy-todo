const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pw = require('../helpers/password.js')

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      "invalid format"
    ],
    validate: {
      validator: function(v) {
        return new Promise(function(resolve, reject) {
          mongoose.model('User', userSchema).findOne({ email: v })
          .then(user => {
            if(user) {
              resolve(false)
            }
            resolve(true)
          })
        })
      },
      message: "not unique"
    }
  },
  password: {
    type: String,
  },
});

userSchema.pre('save', function(next) {
  this.password = pw.hash(this.password);
  next()
});

module.exports = mongoose.model('User', userSchema);