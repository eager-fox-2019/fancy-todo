jwt = require('jsonwebtoken')
require('dotenv').config()


module.exports = function (req, res, next) {
    // if(localStorage.getItem('token')){
    if (req.headers.hasOwnProperty('token')) {
        try {
            const decoded = jwt.verify(req.headers.token, "kalduayam")//proccess.env.SECRET_SAUCE)
            // console.log(decoded)
            req.decoded = decoded
            next()
        } catch (err) {
            console.log(err)
            res.status(500).send({ error: err, message: ' ' })
        }
    }
    else {
        res.status(401).send({ message: 'unauthorized access' })
    }
}
