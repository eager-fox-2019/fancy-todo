const Project = require('../models/project')
const Todo = require('../models/todo')
const User = require('../models/user')

class ProjectController {
    static members(req, res) {
        Project
        .findOne({_id:req.headers.projectid})
        .populate('userId', 'name')
        .then((data) => {
            res.status(200).json(data.userId)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static list(req, res) {
        Project
        .find({userId:req.headers.id})
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static create(req, res) {
        const {name,userId} = req.body
        
        Project
        .create({
            name
        })
        .then(project=> {
            return Project.findOne({_id: project._id})
        })
        .then(result => {
            result.userId.push(userId)
            return result.save()
        })
        .then(update => {
            res.status(201).json(update)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getTodo(req, res) {
        Project
        .find({$and: [{userId: req.headers.userId}, {_id: req.headers.projectid}]})
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static update(req, res) {
        const id = req.params.id
        let object = {}
        Object.keys(req.body).forEach(el =>{
            object[el] = req.body[el]
        })

        Project.findOneAndUpdate({_id: id}, object, {new: true})
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static addMember(req, res) {
        let userId = ''
        
        User
        .findOne({email: req.body.email })
        .then(user => {
            if(user) {
                userId = user._id

                return Project
                .findOne({_id:req.headers.projectid})
                .then(project => {
                    if(!project.userId.includes(userId)) {
                        project.userId.push(userId)
                        return project.save()
                    }else{
                        res.status(400).json('User has been registered')
                    }
                })
                .then(result => {
                    res.status(200).json(result)
                })
                .then(err => {
                    res.status(500).json(err)
                })
            }else{
                res.status(401).json('User not found')
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static removeMember(req, res) {
        const id = req.params.id
        let userDeleted = ''
        
        User
        .findOne({_id: id})
        .then(user => {
            if(user) {     
                userDeleted = user.name
                           
                return Project
                .findOne({_id:req.headers.projectid})
                .then(project => {
                    project.userId.pull(id)
                    return project.save()
                })
                .then(result => {
                    res.status(200).json(userDeleted)
                })
                .then(err => {
                    res.status(500).json(err)
                })
            }else{
                res.status(401).json('User not found')
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static setName(req, res) {
        const projectId = req.params.id
        const {name} = req.body

        Project
        .findByIdAndUpdate({_id: projectId}, {name}, {new: true})
        .then(project => {
            if(project) {
                res.status(200).json(project)
            }else{
                res.status(400).json('Project not found')
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static delete(req, res) {
        const id = req.params.id

        Project.findOneAndDelete({_id: id})
        .then(project => {
            if(project) {
                return Todo.deleteMany({projectId:id})
            }else{
                res.status(400).json({err: 'Project not found'})
            }
        })
        .then(deletedTodo => {
            res.status(200).json(deletedTodo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

module.exports = ProjectController
