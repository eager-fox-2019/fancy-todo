const mongoose = require('mongoose')
const Schema = mongoose.Schema
const hashPassword = require('../helpers/hashPassword')

const usersSchema = new Schema({
  email: {
    type: String,
    validate: [{
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },{
      validator: function(value) {
        return new Promise ((resolve, reject) => {
          User.findOne({email: value})
          .then (member => {
            if (member){
              resolve (false)
            } else {
              resolve (true)
            }
          })
          .catch(err => {
            reject (err)
          })
        })
      },
      message: props => `${props.value} is already used!`
    }]
  },
  password: String
});

usersSchema.pre('save', function(next) {
  if(!this.isModified("password")) {
    return next();
  }
  this.password = hashPassword(this.password)
  next();
})



const User = mongoose.model('User', usersSchema)
module.exports = User