const bcrypt = require('bcryptjs')

module.exports = {
    hash (pass) {
        let salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(pass, salt)
    },
    match (pass, hash) {
        return bcrypt.compareSync(pass, hash)
    }
}