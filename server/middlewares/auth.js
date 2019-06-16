const { verifyToken } = require('../helpers/jwt')

module.exports = {
    authentication (req, res, next){
        if(req.headers.hasOwnProperty('token')){
            try{
                const decode = verifyToken(req.headers.token)
                req.decode = decode
                next()
            } catch(err){
                err.status = 400
                res.json({
                    message: 'Unverified token'
                })
            }
        } else {
            next({status: 400})
            res.json({
                message: 'Token not found'
            })
        }
    }
}