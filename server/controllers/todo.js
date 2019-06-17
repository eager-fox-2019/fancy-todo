const User = require('../models/user')
const Todo = require('../models/todo')

class Controller{
    static readTodo(req,res,next){
        Todo
        .find({
            userId:req.user.id
        })
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(next)
    }

    static readFinishTodo(req,res,next){
        Todo
        .find({
            status:"Finished",
            userId:req.user.id
        })
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(next)
    }

    static readUnfinishTodo(req,res,next){
        Todo
        .find({
            status:"Unfinished",
            userId:req.user.id
        })
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(next)
    }

    static createTodo(req,res,next){
        const {title,description,category,dueDate} = req.body
        Todo
        .create({
            title,description,category,dueDate,userId:req.user.id
        })
        .then((todo) => {
            res.status(200).json({todo, message: 'Successfully Created Todo'})
        })
        .catch(next)
    }

    static finishTodo(req,res,next){
        Todo
        .findOneAndUpdate({
            _id:req.params.id
        },
        {  
            status:"Finished"
        },{ new:true })
        .then((todo) => {
            res.status(200).json({
                todo,
                message: "Success Finished task"
            })
        })
        .catch(next)
    }

    static unfinishTodo(req,res,next){
        Todo
        .findOneAndUpdate({
            _id:req.params.id
        },
        { 
            status:"Unfinished"
        },{ new:true })
        .then((todo) => {
            res.status(200).json({
                todo,
                message: "Success Finished task"
            })
        })
        .catch(next)
    }

    static updateTodo(req,res,next){
        Todo
        .findOneAndUpdate({
            _id:req.params.id
        },
        { 
            title:req.body.title,
            description: req.body.description,
            category:req.body.category,
            dueDate:req.body.dueDate
        },{ new:true })
        .then((todo) => {
            res.status(200).json({
                todo,
                message: "Success update task"
            })
        })
        .catch(next)
    }

    static deleteTodo(req,res,next){
        Todo.deleteOne({
            _id:req.params.id
        })
        .then(() => {
            res.status(200).json({
              message: "Success delete task"
            })
          })
        .catch(next)
    }

    static showOneTodo( req, res, next) {
        Todo
            .findById(req.params.id)
            .then((data) => {
                res.status(200).json(data)
            })
            .catch(next)
    }
}
module.exports = Controller