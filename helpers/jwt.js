const jwt = require("jsonwebtoken")

module.exports = {
    generateToken(input){
        return jwt.sign(input, process.env.JWT_SECRET)
    },

    verifyToken(token){
        return jwt.verify(token, process.env.JWT_SECRET)
    }
}