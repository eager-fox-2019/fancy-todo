const { verifyToken } = require('../helpers/token')
const Users = require('../models/user')
const Todos = require('../models/todo')

const auth = (req, res, next) => {
  if (req.headers.hasOwnProperty('token')) {
    try {
      const decode = verifyToken(req.headers.token)
      req.decode = decode

      Users.findOne({ email: decode.email })
      .then(user => {
        if (user) next()
        else next({ code: 400, message: `Invalid Token. Please re-login` })
      })
      .catch(next)
    }
    catch (err) { next({ code: 400, message: `Invalid Token. Please login/register` }) }
  }
  else next({ code: 400, message: `No token provided. Please login/register`})
}

const authorization = (req, res, next) => {
  Todos.findById(req.params.id)
  .then(todo => {
    if (todo.userId.toString() === req.decode._id) next()
    else next({ code: 401 })
  })
  .catch(next)
}

module.exports = {
  auth,
  authorization
}