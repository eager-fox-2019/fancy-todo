const Todo = require('../models/todo')

class TodoController{

    static getAll(req,res,next){
        Todo
        .find({userId: req.loggedUser.id, projectId: null},{},{
            sort: {
                dueDate: 1
                }
        })
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static getAllInProject(req,res,next){
        Todo
        .find({projectId: req.params.id},{},{
            sort: {
                dueDate: 1
                }
        })
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static getOne(req,res,next){
        Todo
        .findById(req.params.id)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static create(req,res,next){
        let newTodo = {
          title: req.body.title,
          description: req.body.description,
          dueDate: req.body.dueDate,
          userId: req.loggedUser.id,
          status: 'undone',
          projectId: req.body.projectId || null
        }
        Todo.create(newTodo)
            .then(data =>{
                res.status(200).json(data)
            })
            .catch(next)
    }

    static createInProject(req,res,next){
        let newTodo = {
          title: req.body.title,
          description: req.body.description,
          dueDate: req.body.dueDate,
          userId: req.loggedUser.id,
          projectId: null,
          status: 'undone',
          projectId: req.body.projectId
        }
        Todo.create(newTodo)
            .then(data =>{
                res.status(200).json(data)
            })
            .catch(next)
    }

    static update(req,res,next){
      console.log('masuk edit')
        let setVal = {}
        req.body.title && (setVal.title = req.body.title)
        req.body.description && (setVal.description = req.body.description)
        req.body.dueDate && (setVal.dueDate = req.body.dueDate)
        req.body.status && (setVal.status = req.body.status)
        Todo
        .findById(req.params.id)
        .then(todo =>{
            todo.set(setVal)
            return todo.save()
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req,res,next){
        Todo
        .findByIdAndDelete(req.params.id)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

}

module.exports = TodoController