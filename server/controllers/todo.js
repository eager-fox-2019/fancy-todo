const Model = require('../models');

class Todo {

  static create(req, res, next) {
    let todoObj = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate,
      userEmail: req.decode.email
    }

    let todo = new Model.Todo(todoObj);

    todo.save()
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => {
        next(err);
      })
  }

  static getTodo(req, res, next) {
    Model.Todo.find({
        userEmail: req.decode.email
      }).sort({
        dueDate: -1
      })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        next(err);
      })
  }

  static getTodoById(req, res, next) {
    Model.Todo.find({
        _id: req.params.todoId
      }).then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        next(err);
      })
  }

  static update(req, res, next) {
    let todoObj = {};

    if (req.body.name) {
      todoObj['name'] = req.body.name;
    }

    if (req.body.description) {
      todoObj['description'] = req.body.description;
    }

    if (req.body.status) {
      todoObj['status'] = req.body.status;
    }

    if (req.body.dueDate) {
      todoObj['dueDate'] = req.body.dueDate;
    }

    Model.Todo.updateOne({
        _id: req.params.todoId
      }, todoObj)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => {
        next(err);
      });
  }

  static delete(req, res, next) {
    Model.Todo.deleteOne({
        _id: req.params.todoId
      })
      .then((response) => {
        res.status(201).json(response)
      })
      .catch((err) => {
        next(err);
      })
  }
}

module.exports = Todo;