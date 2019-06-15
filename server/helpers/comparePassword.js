const bcrypt = require('bcryptjs')

module.exports = (password, inputPssword) => {
  return bcrypt.compareSync(inputPssword, password)
}