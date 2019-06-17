const Todo = require('../models/todo')

class TodoController{
    static add(req, res){
        let newTodo = new Todo ({
            userId : req.body.userId,
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
        let id = req.body.id
        let field = req.body.field
        let value = req.body.value
        Todo.findByIdAndUpdate(id, {
            [field] : value
        })
            .then(data => {
                res.json({ message : 'updated', response : data})
            })
            .catch(err => {
                res.json(err)
            })
    }

    static delete(req, res){
        let id = req.params.id

        Todo.deleteOne({
            _id : id
        })
            .then(data => {
                res.json({message : 'deleted', response : data})
            })
            .catch(err => {
                res.json(err)
            })
    }

    static readAll(req, res){
        let id = req.params.id

        Todo.find({})
            .then(data => {
                // data.forEach(el => {
                //     el.userId = populate()
                // })
                res.json(data)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
}

module.exports = TodoController