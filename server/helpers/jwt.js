const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: function(payload) {
        return jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
            expiresIn : '1h'
        })
    },
    verify: function(token){
        return jwt.verify(token, process.env.SECRET_KEY_TOKEN)
    }
}