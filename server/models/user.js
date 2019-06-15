const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {hashPassword} = require('../helpers/bcrypt')

const UserSchema = new Schema ({
  email: {
    type: String,
    validate: {
      validator: function(value) {
        return User.findOne({email: this.email})
        .then(user => {
          if(user) {
            return false
          }
        })
      },
      message: props => `${props.value} is already registered`
    },
    required: [true, 'Email is required']
  },
  password: String,
}, {
  timestamps: true
})

UserSchema.pre('save', function(next) {
    let hash = hashPassword(this.password)
    this.password = hash
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User