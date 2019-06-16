const todos = require('../models/todoModel')
const moment = require('moment')

class todoController {
    static create(req,res,next) {
        let input = {
            userId : req.logedUser._id,
            name : req.body.name || 'untitled',
            description : req.body.description,
            status : req.body.status,
            dueDate :req.body.dueDate || new Date()
        }
        todos.create(input)
        .then( (newTask) => {
            res.status(201).json(newTask)
        })
        .catch(next)
    }
    
    static update (req,res,next){
        let update = {}
        if (req.body.name) {
            update.name = req.body.name
        }
        if (req.body.status) {
            update.status = req.body.status
        }
        if (req.body.description) {
            update.description = req.body.description
        }
        if (req.body.date) {
            update.dueDate = req.body.date
        }

        todos.findByIdAndUpdate({
            _id : req.params.taskId
        },update)
        .then( (updatedData)=> {
            res.status(200).json(updatedData)
        })
        .catch(next)
    }

    static remove (req,res,next) {

        todos.findOneAndDelete({
            _id : req.params.taskId 
        })
        .then( (deletedTask) => {
            res.status(200).json(deletedTask)
        })
        .catch(next)

    }

    static allTodo(req,res,next) {
        todos.find({
            userId : req.logedUser._id
        })
        .then( (tasks) => {
            tasks.forEach( (task) => {
                let biasa = moment(task.dueDate).format("MMM Do YY")
                task.dueDate = biasa
            })
            res.status(200).json(tasks)
        })
        .catch(next)
    }
    
    static detail(req,res,next) {
        todos.findOne({
            _id : req.params.id
        })
        .then( (task) => {
            res.json(task)
        })
        .catch(next)
    }
}

module.exports = todoController