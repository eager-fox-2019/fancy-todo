const jwt = require('jsonwebtoken')

function sign(payload) {
  return jwt.sign(payload, process.env.KUNCI)
}

function verify(token) {
  return jwt.verify(token, process.env.KUNCI)
}

module.exports = {
  sign, verify
}