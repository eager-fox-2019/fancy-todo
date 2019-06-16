const Todo = require('../models/todo.js')

class Controller {
  static create(req, res, next) {
    let props = {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      owner: req.userData.id,
    }
    
    Todo.create(props)
    .then(todo => {
      console.log("created 1 todo")
      res.status(201).json(todo)
    })
    .catch(next)
  }
  
  static findAll(req, res, next) {
    // Only current users todos
    Todo.find({ owner: req.userData.id })
    .populate('owner')
    .sort({dueDate: 'asc'})
    .exec()
    .then(todos => {
      // req.query.status is 0 for 'not done' todos and 1 for 'done' todos
      if(req.query.status === '0') {
        todos = todos.filter(todo => todo.status === 0)
      } else if(req.query.status === '1') {
        todos = todos.filter(todo => todo.status === 1)
      } 

      res.json(todos)
    })
    .catch(next)
  }
  
  static findOne(req, res, next) {
    Todo.findById(req.params.id)
    .exec()
    .then(todo => {
      res.json(todo)
    })
    .catch(next)
  }
  
  static delete(req, res, next) {
    Todo.findByIdAndDelete(req.params.id)
    .exec()
    .then(() => {
      console.log("deleted 1 todo")
      res.status(204).end()
    })
    .catch(next)
  }
  
  static update(req, res, next) {
    let updates = Object.assign({}, req.body)
    Todo.findByIdAndUpdate(req.params.id,
      { $set: updates },
      { new: true },
    )
    .exec()
    .then(todo => {
      console.log("updated 1 todo")
      res.json(todo)
    })
    .catch(next)
  }
}

module.exports = Controller