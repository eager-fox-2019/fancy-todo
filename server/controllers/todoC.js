const todos = require('../models/todoM')
// const  dateConvert  = require('../helpers/dateConverter')
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
            .then(result=> {
                console.log (result,'berhasil')
                res.status(201).json(result)
            })
            .catch(next)
    }
    
    static update (req,res,next){
        // console.log('update doonggg')
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
        // console.log(update,'ini update')
        todos.findByIdAndUpdate({
            _id : req.params.taskId
        },update)

            .then(result=> {
                // console.log (result)
                res.json(result)
            })
            .catch(next)
    }

    static remove (req,res,next) {

        todos.findOneAndDelete({
            _id : req.params.taskId 
        })
            .then(result=> {
                res.status(200).json(result)
            })
            .catch(next)
    }

    static allTodo(req,res,next) {
        todos.find({
            userId : req.logedUser._id
        })
            .then(result=> {
                result.forEach(el=> {
                    let biasa = moment(el.dueDate).format("MMM Do YY")
                    
                    el.dueDate = biasa
                })
                
                res.status(200).json(result)
            })
            .catch(next)
    }
    
    static detail(req,res,next) {
        todos.findOne({
            _id : req.params.id
        })
            .then(result=> {
                res.json(result)
            })
            .catch(next)
    }
}

module.exports = todoController