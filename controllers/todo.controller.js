const Todo = require('../models/todo')
const mongoose = require('mongoose')

class TodoController { 
    static async create(req, res, next) {
        let user = req.user
        let {textData, quillData, dueDate, name, htmlData} = req.body
        try {
            let todo = await Todo.create({ textData, quillData, dueDate, name, status: false, user, htmlData })
            let {_id} = todo
            res.json({_id, textData, quillData, dueDate, name})
        } catch(err) {
            console.log('todo create error', err)
            next({code: 400, msg: err.message})
        }
    }

    static async list(req, res, next) {
        let user = req.user
        try {
            let queryResult = await Todo.find({user}).exec()
            let todos = queryResult.map(val => {
                let {name, textData, quillData, dueDate, status, htmlData, _id} = val
                return { name, textData, quillData, dueDate, status, htmlData, _id }
            })
            res.json(todos)
        } catch(err) {
            console.log('todo list error', err)
            next(err)
        }
    }

    static async detail(req, res, next) {
        let { id } = req.params
        let user = req.user
        try {
            let todo = await Todo.findOne({_id: id, user}).exec()
            if (todo) {
                let { name, textData, quillData, dueDate, status } = todo
                res.json({ name, textData, quillData, dueDate, status })
            } else {
                next(err)
            }
        } catch(err) {
            console.log('todo detail error')
            next(err)
        }
    }

    static async update(req, res, next) {
        let id = req.params.id
        let { textData, quillData, name, dueDate, status, htmlData} = req.body
        console.log(req.body)
        let user = req.user
        try {
            let todo = await Todo.findOne({ _id: id, user }).exec()
            if (todo) {
                if (textData) todo.textData = textData
                if (quillData) todo.quillData = quillData
                if (name) todo.name = name
                if (dueDate) todo.dueDate = dueDate
                if (status || status !== 'false') todo.status = status
                if (htmlData) todo.htmlData = htmlData
                await todo.save()
                res.json({ name, textData, quillData, dueDate, status })
            } else {
                next({code: 400, msg: 'id not found'})
            }
        } catch (err) {
            console.log('todo detail error', err)
            next(err)
        }
    }

    static async delete(req, res, next) {
        let {id} = req.params
        let user = req.user
        try {
            let todo = await Todo.deleteOne({_id: id, user}).exec()
            res.json(todo)
        } catch(err) {
            console.log('todo delete error', err)
            next(err)
        }

    }
}

module.exports = TodoController