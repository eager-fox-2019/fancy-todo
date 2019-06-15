const { Todo } = require('../models')

class TodoController{
    static findAll(req, res, next){
        Todo.find()
            .then(todos => {
                res.json(todos)
            })
            .catch(next)
    }

    static findBy(req, res, next){
        let query = Object.keys(req.query).reduce((acc, el) => Object.assign(acc, { [el]: new RegExp(req.query[el], "i")}), {})
        Todo.find(query)
            .then(todos => {
                res.json(todos)
            })
            .catch(next)
    }

    static create(req, res, next){
        const { name, description, status, due_date, assign } = req.body
        const input = { name, description, status, due_date, assign }
        Todo.create(input)
            .then(newTodo => {            
                res.status(201).json(newTodo)
            })
            .catch(next)
    }

    static updatePatch(req, res, next){
        let searchObj = {
            _id: ObjectId(req.params.id)
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
                    throw {code: 404}
                } else {
                    res.json(result)
                }
            })
            .catch(next)
    }

    static delete(req, res, next){
        let searchObj = {
            _id: ObjectId(req.params.id)
        }
        Todo.deleteOne(searchObj)
            .then(result => {
                if(!result || result.n === 0){
                    throw {code: 404}
                } else {
                    res.json(result)
                }
            })
            .catch(next)
    }
}

module.exports = TodoController