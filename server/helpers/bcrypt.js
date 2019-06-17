const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

const hashPassword = (input) => {
  return bcrypt.hashSync(input, salt)
}

const verifyPassword = (input, password) => {
  return bcrypt.compareSync(input, password)
}

module.exports = {hashPassword, verifyPassword}