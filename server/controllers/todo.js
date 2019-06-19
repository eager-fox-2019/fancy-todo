const Todos = require('../models/todo')

class TodoController {
  static create(req, res, next) {
    req.body = Object.assign({ userId: req.decode._id }, req.body) //order object
    req.body.status = 'Not Completed'
    
    Todos.create(req.body)
    .then(todo => {
      res.status(201).json(todo)
    })
    .catch(next)
  }

  static listByUId(req, res, next) {
    Todos.find({
      userId: req.decode._id,
      status: req.query.status
    })
    .then(todos => { res.json(todos) })
    .catch(next)
  }

  static update(req, res, next) {
    Todos.findByIdAndUpdate(req.params.id, { status: req.query.status })
    .then(result => { res.json(result) })
    .catch(next)
  }

  static delete(req, res, next) {
    Todos.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: `success` }))
    .catch(next)
  }
}

module.exports = TodoController