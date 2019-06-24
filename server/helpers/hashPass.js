const bcrypt = require('bcrypt')
function hashSync(input) {
  return bcrypt.hashSync(input, 8)
}
function compareSync(input, hashedPass) {
  return bcrypt.compareSync(input, hashedPass)
}
module.exports = {
  hashSync,
  compareSync
}