const Todo = require('../models/todo')
const mongoose = require('mongoose')
const Obj = mongoose.Types.ObjectId

class TodoCont {
  static create(req, res, next) {
    let obj = {}
    Todo.schema.eachPath(path => {
      if(path === 'user')
        obj['user'] = req.decoded._id
      else
        obj[path] = req.body[path]
    })
    Todo.create(obj)
      .then(row => {
        res.status(201).json(row)
      })
      .catch(next)
  }

  static read(req, res, next) {
    let obj = {}
    if (req.query.status)
      obj.status = req.query.status
    Todo.find(obj)
      .then(rows => {
        res.json(rows)
      })
      .catch(next)
  }

  static readOne(req, res, next) {
    Todo.findById(req.params.id)
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }

  static update(req, res, next) {
    let obj = {}

    if (req.method === "PATCH") {
      Todo.schema.eachPath(path => {
        if (req.body[path])
          obj[path] = req.body[path]
      })
    }
    else {
      Todo.schema.eachPath(path => {
      if(path === 'user' || path === '_id' || path === '__v') {
        if(req.body['user'])
          obj['user'] = req.body['user']
      }
      else
        obj[path] = req.body[path]
      })
    }
    
    Todo.findByIdAndUpdate(req.params.id, obj, { new: true })
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    Todo.findByIdAndDelete(req.params.id)
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }
}

module.exports = TodoCont