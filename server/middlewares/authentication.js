const jwt= require('jsonwebtoken')
const User= require('../models/user')

function authentication(req, res, next){
    console.log('masuk authen')
    if(req.headers.hasOwnProperty('token')){
        let decode= jwt.verify(req.headers.token, process.env.SECRET_KEY_TOKEN)
        req.decode= decode

        User.findOne({ email:req.decode.email})
        .then(user=>{
            if(user){
                next()
            }else{
                res.status(404).json('Not Found')
            }
        })

    }else{
        console.log('error authen')
        res.status(403).json('Not Authenticated')
    }
    
}

module.exports= authentication