const Helper = require('../helpers/helper')
const Todo = require('../models/todo')

let middlewares = {
  isUser: function (req, res, next) {
    let token = req.headers.token
    Helper.verifyJWT(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        res.status(400).json({ message: 'invalid token' })
      } else {
        req.user = decoded
        next()
      }
    });
  },
  isAuthorize: function (req, res, next) {
    let token = req.headers.token
      Todo.findOne({ _id: req.params.id })
        .then(todo => {
          if (todo.userId.toString() === req.user._id.toString()) {
            next()
          } else {
            res.status(401).json({ message: 'unauthorize' })
          } 
        })
        .catch(error=>{
          res.status(400).json(error)
        })
    }
}

module.exports = middlewares