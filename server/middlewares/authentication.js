const jwt = require('../helpers/jwt')
const User = require('../models/User')


function authentication(req, res, next){
    
    
    if(req.headers.hasOwnProperty('token')){
        req.decoded = jwt.decode(req.headers.token)
        User.findOne({email : req.decoded.email})
        .then((gotData)=>{
            if(!gotData){
                throw {code : 404, message:"user not found"}
            } else {
                next()
            }
        })
        .catch(next)
    } else {
        throw {code : 401, message : "Unauthorized"}
    }
}

module.exports = authentication