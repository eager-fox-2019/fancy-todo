const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Name required.`],
  },
  email: { 
    type: String,
    required: [true, 'Email is required.'],
    validate : {
      validator : function(value) {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          throw 'Invalid email format'
        }
      },
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  }
})

let User = mongoose.model('User', userSchema)

User.schema.path('email').validate(function (input) {
  return User.find({ 
     _id : { $ne: this._id },  
     email: input 
    })
    .then(data => {
      if(data.length !== 0) {
        return false
      } else {
        return true
      }
    })
    .catch(err => {console.log(err)})
}, 'Email already used.')

module.exports = User
