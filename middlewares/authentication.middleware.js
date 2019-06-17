let { verify } = require('../helpers/jwt.helper')

module.exports = (req, res, next) => {
    let token = req.headers.token
    if (token) {
        try {
            let payload = verify(token)
            req.user = payload.user
            next()
        } catch (err) {
            console.log('auth middleware error', err)
            next({ err: 400, msg: 'invalid token' })
        }
    } else {
        next({ err: 400, msg: 'token must be provided' })
    }
}