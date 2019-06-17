const Todo = require("../models/todo")
const axios = require("axios")
class TodoController{
    static Create(req, res, next){
        var time = [+req.body.time.split(":")[0], +req.body.time.split(":")[1]]
        var date = new Date()
        date.setHours(time[0], time[1])
        var newTodo = new Todo({
            userId: req.headers.payload.id,
            task: req.body.task,
            time: date,
            type: req.body.type,
            status: false
        })
        newTodo.save()
        .then(created =>{
            res.status(201).json(created)
        })
        .catch(next)
    }
    
    static Bored(req, res, next){
        axios.get(`http://www.boredapi.com/api/activity?type=${req.query.type}`)
        .then(activity =>{
            res.status(200).json(activity.data)
        })
        .catch(next)
    }

    static findAll(req, res, next){
        Todo.find({userId: req.headers.payload.id})
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(next)
    }

    static update(req, res, next){
        return Todo.update({_id: req.query.id},{
            task: req.body.task,
            time: req.body.time,
            type: req.body.type,
            status: req.body.status
        })
        .then(updated =>{
            return Todo.findOne({_id: req.query.id})
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req, res, next){
        return Todo.deleteOne({_id: req.query.id})
        .then(deleted =>{
            console.log(deleted)
            res.status(200).json("Successfully deleted task")
        })
        .catch(next)
    }
}

module.exports = TodoController