const mongoose = require('mongoose')
const {encrypt} = require('../helpers/bcrypt')

let Schema = mongoose.Schema

let user = new Schema({
  userName: {
    type: String,
    required: [true,'User Name Cannot Be Empty']
  },
  email:{
    type: String,
    required: [true,'Email Cannot Be Empty'], 
    validate: [
      {
        validator: function(email){
          let regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
          return regex.test(email);
        },
        message: "Invalid Email"
      },
      { 
        validator: function (v) {
          return mongoose
              .model('User', user)
              .findOne({
                  _id: {
                      ne: this._id
                  },
                  email: v
              })
              .then(found => {
                  if (found) {
                      return false;
                  } else {
                      return true;
                  }
              })
              .catch(err => {
                  return err.messsage
              })
        },
        message: 'Email Is Already Registered'
      }
    ]
  },
  password:{
      type: String,
      required: [true,'Password Cannot Be Empty']
  }
})

user.pre('save', function(next){
  this.password = encrypt(this.password)
  next()
})

let User = mongoose.model('User', user)

module.exports = User