const Todo = require('../models/todo')
const ObjectID = require('mongodb').ObjectID


class TodoController {
    static addTodo(req,res,next){
        // console.log(req.decode)
        Todo.create({
            user: req.decode.id,
            task: req.body.task,
            description: req.body.description,
            status: false,
            dueDate: req.body.dueDate,
            time: req.body.time
        })
            .then(newTask => {
                res.status(200).json(newTask)
            })
            .catch(next)
    }

    static findTodos(req,res,next){
        Todo.find({
            user: ObjectID(req.decode.id)
        })
            .then(list => {
                res.status(200).json(list)
            })
            .catch(next)
    }

    static deleteTodo(req,res,next){
        Todo.deleteOne({
            user: ObjectID(req.decode.id),
            task: req.body.task,
            dueDate: req.body.dueDate,
            time: req.body.time
        })
            .then(todo => {
                res.status(200).json(todo)
            })
            .catch(next)
    }

    static checkTodo(req,res,next){
        Todo.updateOne({
            user: ObjectID(req.decode.id),
            task: req.body.task,
            dueDate: req.body.dueDate,
            time: req.body.time
        }, {
            status: true
        })
            .then(todo => {
                console.log(todo)
                res.status(200).json(todo)
            })
            .catch(next)
    }
}

module.exports = TodoController