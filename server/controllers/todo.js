const Todo = require('../models/todo')

class ControllerTodo {
    static findAll(req, res, next) {
        Todo
            .find({
                userId: req.decoded.id
            })
            .then(resp => {
                res.status(200).json(resp)
            })
            .catch(next)
    }
    static findOne(req, res, next) {
        Todo
            .findById(req.params.id)
            .then(resp => {
                if (resp) {
                    res.status(200).json(resp)
                } else {
                    throw ({
                        status: 404,
                        msg: "Not Found"
                    })
                }
            })
            .catch(next)
    }
    static create(req, res, next) {
        let data = {
            name: req.body.name,
            description: req.body.description,
            dueDate: req.body.dueDate,
            status: req.body.status,
            userId: req.decoded.id,
            projectId: req.body.projectId
        }
        Todo
            .create(data)
            .then(resp => {
                res.status(201).json(resp)
            })
            .catch(next)
    }
    static patch(req, res, next) {
        let data = {
            name: req.body.name,
            description: req.body.description,
            dueDate: req.body.dueDate,
            status: req.body.status,
        }
        Todo
            .findById(req.params.id)
            .then(resp => {
                resp.name = req.body.name
                resp.description = req.body.description
                resp.dueDate = req.body.dueDate
                resp.status = req.body.status

                return resp.save()
            })
            .then(update => {
                res.status(200).json(update)
            })
            .catch(next)
    }
    static delete(req, res, next) {
        Todo
            .findByIdAndDelete(req.params.id)
            .then(resp => {
                res.status(200).json({
                    id: req.params.id
                })
            })
            .catch(next)
    }
    static navStatus(req, res, next) {
        Todo
            .find({
                status: req.params.status,
                userId: req.decoded.id
            })
            .then(resp => {
                res.status(200).json(resp)
            })
            .catch(next)
    }
}

module.exports = ControllerTodo