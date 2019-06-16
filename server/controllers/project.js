const { Project } = require('../models')
const { Todo } = require('../models')

class ControllerProject {
    static create(req,res,next) {
        let { title } = req.body
        let userId = req.user._id
        let newProject = new Project({
            title
        })
        newProject.members.push(userId)
        newProject.userId = userId
        newProject.save()
        .then(data =>{
            res.status(201).json(data)
        })
        .catch(next)
    }
    static findAll(req,res,next) {
        let memberId = req.user._id
        Project.find({ members : memberId })
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }
    static findOne(req,res,next) {
        Project.findOne({ _id : req.params.id })
        .populate('members')
        .populate('todos')
        .then(data =>{
            if(!data) {
                next({ code : 400, message : 'Bad Request' })
            }else{
                res.status(200).json(data)
            }
        })
        .catch(next)
    }
    static addMember(req,res,next) {
        
        let { userId } = req.body // userId
        let value = { $push: { members: userId } }

        Project.findOneAndUpdate({ _id : req.params.id}, value, { new : true })
        .then(data =>{
            if(!data) {
                throw({ code : 400, message : 'Bad Request' })
            }else{
                res.status(200).json(data)
            }
        })
        .catch(next)
    }
    static delete(req,res,next) {
        Project.findOneAndDelete({ _id : req.params.id })
        .then(data =>{
            res.status(200).json({
                message : 'Delete project successfully'
            })
        })
        .catch(next)
    }
    static deleteTodo( req, res, next ) {
        Todo.findOneAndDelete({ _id : req.params.todoId })
        .then(data =>{
            return Project.findOneAndUpdate({ _id : req.params.projectId }, { $pull : { todos : req.params.todoId } })
        })
        .then(data =>{
            if(!data) {
                throw({ code : 400, message : "Bad request" })
            }
            res.status(200).json(data)
        })
        .catch(next)
    }
    static addTodo( req, res, next ) {
        let projectId = req.params.projectId
        let userId = req.user.id
        let value = { ...req.body, ...{ userId } }
        let newTodo = new Todo ({
            title : value.title,
            description : value.description,
            due_date : value.due_date,
            userId : value.userId,
            projectId : value.projectId
            
        })
        newTodo.save()
        .then(data =>{
            let  todoId  = data._id
            let value = { $push: { todos: todoId } }
            return Project.findOneAndUpdate({ _id : projectId}, value, { new : true })
        })
        .then(data =>{
            res.status(201).json(data)
        })
        .catch(next)
    }
}

module.exports = ControllerProject
