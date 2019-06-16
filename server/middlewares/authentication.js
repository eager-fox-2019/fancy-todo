const {verify} = require('../helpers/jwt')
const User = require('../models/user')

module.exports = (req, res, next) => {
    if (req.headers.hasOwnProperty('token')) {
        req.decoded = verify(req.headers.token)
        console.log(req.decoded, 'authen decoded')
        User.findOne({
                email: req.decoded.email
            })
            .then(user => {
                if (user) {
                    next()
                } else {
                    throw({
                        status: 401,
                        msg: "Unauthorized"
                    })
                }
            })
            .catch(next)
    } else {
        throw({
            status: 401,
            msg: 'You have to login first'
        })
    }
}