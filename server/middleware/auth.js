const jwt = require('jsonwebtoken')

module.exports = {
    Authentication(req, res, next){
        let theToken = req.headers.token
        //kalo eroorr disini. kalo tojken gaada, error
        //else
        
        // console.log(token)
        if(!theToken){
            res.json({code : 401 , msg : 'you have to login first'})
        }else{
            try {
                let decode = jwt.verify(theToken, process.env.JWT_SECRET)
                req.decode = decode
                next()
            }catch(err) {
                res.json({code : 401 , msg : 'invalid token'})
            }
        }
    }
}