let jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (input) => {
  let token = jwt.sign({
    email: input
  }, process.env.JWT_SECRET, {expiresIn: '4h'} )
  return token
}