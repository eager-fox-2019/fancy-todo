const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hashSync } = require('../helpers/bcrypt')

function isEmail(email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  return emailRegex.test(email)
}

function isUnique(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then(row => {
        if (row)
          resolve(false)
        else
          resolve(true)
      })
      .catch(err => {
        reject(err)
      })
  })
}

let userSchema = new Schema({
  name: String,
  email: {
    type: String,
    validate: [
      { validator: isUnique, msg: props => `${props.value} has been registered!` },
      { validator: isEmail, msg: props => `${props.value} is not a valid email!` }
    ],
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password) {
        if (password.length < 8)
          return false
        else
          return true
      },
      message: 'Password must be more or equal than 8 character!'
    }
  },
})

userSchema.pre('save', function (next) {
  this.password = hashSync(this.password)
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User