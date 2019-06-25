const Helper = require('../helpers/helper')
const Todo = require('../models/todo')
const User = require('../models/user')

let middlewares = {
  isUser: function (req, res, next) {
    req.decoded = Helper.verifyJWT(req.headers.token)
        User.findOne({ _id: req.decoded._id })
            .then(user => {
                if (user) {
                    next()
                } else {
                    res.status(401).json("Unautheticated")
                }
            })
            .catch((err)=> {
              res.status(500).json(err)
            })
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