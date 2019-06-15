const Todo = require('../models/todos')

class ControllerTodo {
  static findAll(req, res, next) {
    Todo.find()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static create(req, res, next) {
    const { name, description, due_date } = req.body
    const input = { name, description, due_date }
    Todo.create(input)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static update(req, res, next) {
    const { name, description, due_date } = req.body
    const input = { name, description, due_date }
    Todo.update()
  }

  static delete(req, res, next) {
    Todo.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }
}

module.exports = ControllerTodo