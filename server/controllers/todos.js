const Todo = require('../models/todos')
const generateDue_date = require('../helpers/generateDue_date')
var ObjectId = require('mongodb').ObjectID;

class ControllerTodo {
  static findAll(req, res, next) {
    Todo.find()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static searchByName(req, res, next) {
    Todo.findOne({name: req.body.name})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static findById(req, res, next) {
    Todo.findById(req.params.id)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static create(req, res, next) {
    const { name, description, date } = req.body
    let due_date = generateDue_date(date)

    const input = { name, description, due_date }
    Todo.create(input)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static update(req, res, next) {
    const { name, description, date, status } = req.body
    let due_date = generateDue_date(date)
    const input = { name, description, due_date, status }
    Todo.updateOne({_id : ObjectId(req.params.id)}, input)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static updateStatus(req, res, next) {
    Todo.updateOne({_id : ObjectId(req.params.id)}, {status: true})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
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