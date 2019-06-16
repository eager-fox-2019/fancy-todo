const user = require('../models/userM')
const jwt = require('jsonwebtoken')

module.exports =  {
    authenticate : function(req,res,next){
        let token = req.headers.token
        if(!token) {
            throw ({code :401 , message :'Unauthorized'})
        }
        else {
            let decode = jwt.verify(token, process.env.JWT_SECRET)
            req.logedUser = decode
            console.log (req.logedUser)
            next()
        }
    },
    authorization : function(req,res,next) {
        
    }


}