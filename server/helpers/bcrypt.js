const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

const hashPassword = (input) => {
	return bcrypt.hashSync(input, salt)
}

const verifyPassword = (input, hashPassword) => {
	return bcrypt.compareSync(input, hashPassword)
}

module.exports = {
	hashPassword: hashPassword,
	verifyPassword: verifyPassword
}