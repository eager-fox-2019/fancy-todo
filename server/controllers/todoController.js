const Todo = require('../models/todo')

class TodoController{
    static add(req, res){
        console.log('masuk add todo')
        let newTodo = new Todo ({
            userId : req.loggedUser.id,
            description : req.body.description,
            status : req.body.status,
            dueDate : req.body.dueDate
        })

        newTodo.save()
            .then(data => {
                res.status(201).json(data)
            })
            .catch(err => {
                res.status(500).json({error : err})
            })
    }

    static update(req, res){
        let id = req.params.id
        let obj = {}
        if (req.body.description) obj.description = req.body.description
        if (req.body.dueDate) obj.dueDate = req.body.dueDate
        if (req.body.status) obj.status = req.body.status
        Todo.findByIdAndUpdate(id, obj)
            .then(data => {
                res.json({ message : 'updated', response : data})
            })
            .catch(err => {
                res.json(err)
            })
    }

    static delete(req, res){
        let id = req.params.id.trim()
        console.log(id, 'ini id braaaaaaaaaay')
        Todo.findByIdAndDelete(id)
            .then(data => {
                res.json({message : 'deleted', response : data})
            })
            .catch(err => {
                res.json(err)
            })
    }

    static readAll(req, res){
        let id = req.params.id

        Todo.find({}).populate('userId')
            .then(data => {
                console.log(data)
                res.json(data)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    }
}

module.exports = TodoController