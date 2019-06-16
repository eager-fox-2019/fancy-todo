const Todo = require('../models/todo')
const ObjectID = require('mongodb').ObjectID
const axios = require('axios')
let ax = axios.create({
    baseURL: 'https://api.imgur.com/3',
    headers: {
        "Authorization": `Client-ID a144a029f6b41b3` //kalau tidak di hardcode kesini malah error
    }
  })
  
class TodoController {
    static addTodo(req,res,next){
        // console.log(req.decode)
        Todo.create({
            user: req.decode.id,
            task: req.body.task,
            description: req.body.description,
            status: false,
            dueDate: req.body.dueDate,
            time: req.body.time,
            image: req.body.image
        })
            .then(newTask => {
                res.status(200).json(newTask)
            })
            .catch(next)
    }

    static findOneTodo(req,res,next){
        Todo.findOne({
            _id: ObjectID(req.params.id)
        })
            .then(task => {
                res.status(200).json(task)
            })
            .catch(next)
    }

    static findTodos(req,res,next){
        Todo.find({
            user: ObjectID(req.decode.id),
            status: false
        })
            .then(list => {
                res.status(200).json(list)
            })
            .catch(next)
    }

    static findChecked(req,res,next) {
        Todo.find({
            user: ObjectID(req.decode.id),
            status: true
        })
            .then(list => {
                res.status(200).json(list)
            })
            .catch(next)
    }

    static deleteTodo(req,res,next){
        Todo.deleteOne({
            _id: ObjectID(req.params.id)
        })
            .then(todo => {
                res.status(200).json(todo)
            })
            .catch(next)
    }

    static checkTodo(req,res,next){
        Todo.updateOne({
            _id: ObjectID(req.params.id)
        }, {
            status: true
        })
            .then(todo => {
                console.log(todo)
                res.status(200).json(todo)
            })
            .catch(next)
    }

    static patchTodo(req,res,next) {
        // console.log('masukk')
        Todo.updateOne({
            _id: ObjectID(req.params.id)
        }, {
            task: req.body.task,
            description: req.body.description,
            dueDate: req.body.dueDate,
            time: req.body.time
        })
            .then(todo => {
                console.log(todo)
                res.status(200).json(todo)
            })
            .catch(next)
    }

    static uploadImgur(req,res,next) {
        ax
            .post('https://api.imgur.com/3/upload', {
                image: req.body.imgUrl,
                type: 'base64',
            })
            .then(imgur => {
                res.status(200).json(imgur.data.data.link)
            })
            .catch(next)
    }
}

module.exports = TodoController