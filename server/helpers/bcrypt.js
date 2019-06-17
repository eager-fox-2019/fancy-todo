const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

function hashPassword(inputPass) {
    return bcrypt.hashSync(inputPass, salt)
}

function verifyPassword(inputPass, hash) {
    return bcrypt.compareSync(inputPass, hash)
}

module.exports = { hashPassword, verifyPassword }