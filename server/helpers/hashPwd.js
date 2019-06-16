bcrypt = require('bcryptjs')

const hashPwd = pwd => bcrypt.hashSync(pwd, 10)
const randHashPwd = () => bcrypt.genSaltSync(8).substring(7, 15)
const pwdMatch = (pwd, hashedPwd) => bcrypt.compareSync(pwd, hashedPwd)

module.exports = { 
  hashPwd,
  randHashPwd,
  pwdMatch
}
