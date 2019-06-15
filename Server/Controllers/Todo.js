const Todo = require("../Models/Todo.js");
const date = require("../Helpers/Date.js");

class TodoController {
  static create(req, res, next) {
    let id = req.decoded.id
    let newTodo = {
      title: req.body.title,
      description: req.body.description,
      status: 0,
      due_date: req.body.due_date,
      group: req.body.group,
      UserId: id
    };
    Todo.create(newTodo)
      .then(result => {
        res.status(201).json(result);
      })
      .catch(next);
  }
  static read(req, res, next) {
    let id = req.decoded.id;
    let tag = req.query.tag;
    let status = req.query.name;
    let output = [];
    let userTodo = {
      UserId: id,
      status: status,
      group: tag 
    }
    if(!tag) delete userTodo.group
    Todo.find(userTodo)
      .then(result => {
        result.forEach(x => {
          output.push(date(x));
        });
        res.status(201).json(output);
      })
      .catch(next);
  }
  static delete(req, res, next) {
    let id = req.params.id;
    Todo.deleteOne({
      _id: id
    })
      .then(result => {
        res.status(201).json(result);
      })
      .catch(next);
  }
  static edit(req, res, next) {
    let id = req.params.id;
    let input = req.body
    let update = {}
    for (let keys in input){
      update[keys] = req.body[keys]
    }
    Todo.findByIdAndUpdate(id, 
      {$set: update},
      {new: true})
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(next);
  }
}

module.exports = TodoController;
