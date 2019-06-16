const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

module.exports = {
    encrypt(pass) {
        return bcrypt.hashSync(pass, salt);
    },
    decrypt(pass, hash) {
        return bcrypt.compareSync(pass, hash);
    }
}