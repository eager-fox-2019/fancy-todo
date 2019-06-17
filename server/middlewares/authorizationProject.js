const Project = require('../models/project')

module.exports = function (req, res, next) {
    console.log(req.params)
    Project
        .findById(req.params.id)
        .then(response => {
            if (response) {
                if (req.decoded.id == String(response.owner)) {
                    next()
                } else {
                    throw ({
                        status: 401,
                        msg: "Unauthorized"
                    })
                }
            } else {
                throw ({
                    status: 404,
                    msg: "Not Found"
                })
            }
        })
        .catch(next)
}