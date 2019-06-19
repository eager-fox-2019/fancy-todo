const mongoose = require('mongoose')
const { hashPwd } = require('../helpers/hashPwd')

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    validate: [{
      validator: function(v) {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/.test(v)
      },
      message: props => `${props.value} is not valid mail address!`,
    },
    {
      validator: function(v) {
        return new Promise((resolve, reject) => {
          User.findOne({ email: v })
          .then(email => {
            if (email) resolve(false)
            else resolve(true)
          })
          .catch(err => { reject(err) })
        }) 
      }, 
      message: props => `${props.value} is already used!`
    }]
  },
  password: String,
}, { timestamps: true })

//Hook
userSchema.pre('save', async function() {
  const hashedPwd = await hashPwd(this.password)
  this.password = hashedPwd
})

const User = mongoose.model('User', userSchema)

module.exports = User