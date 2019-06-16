const User = require('../models/user.js')
const tk = require('../helpers/token.js')

module.exports = (req, res, next) => {
  if(req.headers.authorization) {
    try {
      const decoded = tk.verify(req.headers.authorization);
      User.find({ email: decoded.email })
        .then(users => {
          if(users.length > 0) {
            req.userData = decoded;
            next()
          } else {
            next({ status: 403, msg: "Unauthorized" })
          }
        })
        .catch(next)
    }
    catch (err) {
      next({ status: 401, msg: "Authentication failed" })
    }
  } else {
    next({ status: 401, msg: "Authentication failed" })
  }
}