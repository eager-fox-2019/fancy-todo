const Helper = require('../helpers/helper')

module.exports = (req, res, next) => {
    try {
        const decoded = Helper.verifyJWT(req.headers.access_token);
        req.decoded = decoded
        req.headers.id = decoded.id
        req.headers.name = decoded.name
        
        next()
    } catch (err) {
        res.status(500).json(err)
    }

}