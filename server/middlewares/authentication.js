const Helper = require('../helpers/helper')

module.exports = (req, res, next) => {
    let token = req.headers.token;

    if (!token) {
      res.status(401).json({ error: 'You must login to access this endpoint' });
    } else {
        try {
            const decoded = Helper.verifyJWT(token);
            req.decoded = decoded
            req.headers.id = decoded.id
            req.headers.name = decoded.name
            next()
        } catch (err) {
            res.status(500).json(err)
        }
    }
}