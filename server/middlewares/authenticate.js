const { verify } = require('../helpers/jwt')
const User  = require('../models/user')

module.exports = {
    authenticate: (req, res, next) => {
        let accessToken = req.headers["access-token"]
        if(accessToken) {
            let payload = verify(req.headers["access-token"])
            User.findById(payload.id)
            .then(user => {
                if(user) {
                    req.user = {
                        id: user._id,
                        email: user.email,
                        accessToken: accessToken,
                    }
                    next()
                } else {
                    res.status(401).json({
                        message: 'User not found'
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Please provide a valid accessToken'
                })
            })
        } else {
            res.status(401).json({
                message: 'Please provide a valid accessToken'
            })
        }
    }
}