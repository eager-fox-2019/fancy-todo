const jwt = require('jsonwebtoken')
// require('dotenv').config()

function sign(data){
    return jwt.sign(data, process.env.SECRET_JWT)
}
function decode(data){
    return jwt.verify(data, process.env.SECRET_JWT)
}

module.exports = {
    sign,decode
}