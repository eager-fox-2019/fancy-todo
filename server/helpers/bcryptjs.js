const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

function hash (password) {
let hash = bcrypt.hashSync(password,salt)
return hash
}

function compare (password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

module.exports = {
    hash,
    compare
}