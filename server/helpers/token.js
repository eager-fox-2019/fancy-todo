const jwt = require("jsonwebtoken")

module.exports = {
  sign(payload) {
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '2d' })
  },
  verify(token) {
    return jwt.verify(token, process.env.SECRET)
  }
}