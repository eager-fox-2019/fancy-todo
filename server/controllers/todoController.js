const Todo = require('../models/todoModel')
// const moment = require('moment')

class TodoController{
    static create(req, res, next){
        let { name, description, status, owner, due_date, projectId, members} = req.body
        // let momentDate = moment(due_date).format('LL')
        Todo.create({
            name, description, status, owner, due_date, projectId, members
        })
        .then((newTodo) => {
            res.status(201).json(newTodo)
        })
        .catch(next)
    }

    static read(req, res, next){
        Todo.find({})
        .populate('owner')
        .then((todos) => {
            res.status(200).json(todos)
        })
        .catch(next)
    }

    static readMyTodo(req, res, next){
        let owner = req.params.owner
        Todo.find({
            owner
        })
        .populate('owner')
        .then((myTodos) => {
            res.status(200).json(myTodos)
        })
        .catch(next)
    }

    // static findTodoProject(req, res, next){
    //     let projectId = req.params.projectId
    //     Todo.find({
    //         projectId
    //     })
    //     .populate('member')
    //     .then((myTodos) => {
    //         res.status(200).json(myTodos)
    //     })
    //     .catch(next)
    // }

    static readOne(req, res, next){
        let id = req.params.id
        Todo.findById({
            _id: id
        })
        .populate('owner')
        .then((todo) => {
            res.status(200).json(todo)
        })
        .catch(next)
    }

    static update(req, res, next){
        let id = req.params.id
        let dataUpdate = req.body
        Todo.findByIdAndUpdate(id, dataUpdate, {new:true})
        .then((updated) => {
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req, res, next){
        let id = req.params.id
        Todo.findByIdAndDelete(id)
        .then((deleted) => {
            res.status(200).json(deleted)
        })
        .catch(next)
    }
}

module.exports = TodoController