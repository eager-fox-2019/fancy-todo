const bcrypt = require('bcryptjs')

module.exports = {
    //updated
    hash(inputPassword) {
        return bcrypt.hashSync(inputPassword, bcrypt.genSaltSync(10))
    },
    compare(inputPassword, userPassword) {
        return bcrypt.compareSync(inputPassword, userPassword)
    }
}