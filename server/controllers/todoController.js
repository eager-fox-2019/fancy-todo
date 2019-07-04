const { Todo } = require('../models')

class TodoController{
    static findAll(req, res, next){
        Todo.find()
            .then(todos => {
                res.json(todos)
            })
            .catch(next)
    }

    static findPersonal(req, res, next){
        Todo.find({assign: req.decode.id})
            .then(todos => {
                todos.sort(function(a,b){
                    return new Date(a.due_date) - new Date(b.due_date);
                });
                res.json(todos)
            })
            .catch(next)
    }

    static create(req, res, next){
        const { name, description, due_date } = req.body
        const input = { name, description, due_date }
        input.assign = [req.decode.id]
        Todo.create(input)
            .then(newTodo => {        
                res.status(201).json(newTodo)
            })
            .catch(next)
    }

    static update(req, res, next){
        let searchObj = {
            _id: req.params.todoId,
            assign: req.decode.id
        }
        let updateObj = {}
        let updateKeys = Object.keys(req.body)
        for(let i = 0; i < updateKeys.length; i++){
            updateObj[updateKeys[i]] = req.body[updateKeys[i]]
        }
        let setObj = {
            $set: updateObj
        }
        Todo.updateOne(searchObj, setObj)
            .then(result => {
                if(!result || result.n === 0){
                    throw {code: 404, message: "Task not found"}
                } else {
                    res.json(result)
                }
            })
            .catch(next)
    }

    static delete(req, res, next){
        let searchObj = {
            _id: req.params.todoId,
            assign: req.decode.id
        }
        Todo.deleteOne(searchObj)
            .then(result => {
                if(!result || result.n === 0){
                    throw {code: 404, message: "Task not found"}
                } else {
                    res.json(result)
                }
            })
            .catch(next)
    }
}

module.exports = TodoController