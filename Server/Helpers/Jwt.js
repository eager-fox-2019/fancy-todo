const jwt  = require('jsonwebtoken')
module.exports = {
    sign: function(user) {
      return jwt.sign(user, process.env.SECRET)
    },
    verify: function(token) {
      return jwt.verify(token, process.env.SECRET)
    }
  }