const {verifyToken} = require('../helpers/jwt')

module.exports = {
    authentication(req,res,next) {
        if(req.headers.hasOwnProperty('accesstoken')) {
            try {
                const decode = verifyToken(req.headers.accesstoken)
                req.decode = decode
                next()
            }
            catch(err) {
                next({status: 401, message: "unauthorized"})
            }
        }
        else{
            next({status: 401, message: "unauthorized"})
        }
    }
}