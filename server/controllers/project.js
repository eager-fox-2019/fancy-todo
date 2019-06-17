const Project = require('../models/project')

class ControllerProject {
    static findAll(req, res, next) {
        Project
            .find()
            .populate('owner')
            .populate('members')
            .then(resp => {
                
                res.status(200).json(resp)
            })
            .catch(next)
    }
    static findOne(req, res, next) {
        Project
            .findById(req.params.id)
            .then(resp => {
                res.status(200).json(resp)
            })
            .catch(next)
    }
    static create(req, res, next) {
        let data = {
            name: req.body.name,
            description: req.body.description,
            owner: req.decoded.id,
            members: req.body.members || [],
            pending: req.body.pending || [],
            todos: req.body.todos || []
        }
        Project
            .create(data)
            .then(resp => {
                res.status(201).json(resp)
            })
            .catch(next)
    }
    static patch(req, res, next) {
        let data = {
            name: req.body.name
        }
        Project
            .findOneAndUpdate(req.params.id, data, {
                new: true
            })
            .then(resp => {
                res.status(200).json(resp)
            })
            .catch(next)
    }
    static delete(req, res, next) {
        Project
            .findByIdAndDelete(req.params.id)
            .then(resp => {
                res.status(200).json({
                    id: req.params.id
                })
            })
            .catch(next)
    }
}

module.exports = ControllerProject