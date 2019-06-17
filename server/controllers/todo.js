const models = require('../models');
// const Todo = require('../models/todo');


class todoController{

	static readAll(req, res, next){
      models.Todo.findAll({
        where: {
          userId: req.loggedUser.id
        }
      })
      .then(todos => {
        res.json(todos)
      })
      .catch(next)
  	}


  	static findByPk(req, res, next) {
    models.Todo.findByPk(req.params.id)
      .then(function(todos) {
        if(!todos){
          res.status(404).json({});
        }else{
          res.json(todos);
        }
      })
      .catch(next);
  }

  static create(req, res, next) {
    console.log(req.loggedUser.id)
    const newTodo = {
      title: req.body.title || null,
      description: req.body.description || null,
      userId: req.loggedUser.id
    };
    models.Todo.create(newTodo)
      .then(function(todos) {
        res.status(201).json(todos);
      })
      .catch(next);
  }

  static deleteById(req, res, next) {
    models.Todo.findByPk(req.params.id)
        .then(function(todos){
          if(todos){
            return todos.destroy({
                where: { id: req.params.id }
              })
          }else{
            throw({ code: 404 })
          }
        })
        .then(function (deletedData) {
          res.status(200).json({ id: req.params.id, })
        })
    .catch(next)
  }


  static putUpdate(req, res, next) {
    models.Todo.findByPk(req.params.id)
      .then(function (todos) {
        if(todos){
          todos.title = req.body.title || null
          todos.description = req.body.description || null
        return todos.save()
        }else{
          throw({ code: 404 })
        }
      })
      .then(function (updatedData) {
      res.status(200).json(updatedData)})
    .catch(next)
  }

  static patchUpdate(req, res, next) {
    models.Todo.findByPk(req.params.id)
      .then(function (todos) {
        if(todos){
          todos.title = req.body.title || todos.title
          todos.description = req.body.description || todos.description
        return todos.save()
        }else{
          throw({ code: 404 }) }
      })
      .then(function (updatedData) {
        res.status(200).json(updatedData)})
    .catch(next)
  }
  

}


module.exports = todoController