const Project = require("../models/Project")
const Todo = require('../models/Todo')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class projectController {

    static async getAll(req, res, next) {
        try {
            let owned = await Project.find({
                    owner: req.loggedUser.id
                })
                .populate('todos')
                .populate('members')
                .populate('owner')
            owned.forEach(project => {
                let done = 0
                project.todos.forEach(todo => {
                    if (todo.status) {
                        done++
                    }
                })
                project.progress = done
            })
            let member = await Project.find({
                    members: req.loggedUser.id
                })
                .populate('todos')
                .populate('members')
                .populate('owner')

            member.forEach(project => {
                let done = 0
                project.todos.forEach(todo => {
                    if (todo.status) {
                        done++
                    }
                })
                project.progress = done
            })
            res.json({
                project_owned: owned,
                project_member: member
            })
        } catch (error) {
            next(error)
        }
    }

    static async create(req, res, next) {
        let arrTodos = []
        console.log(req.body);
        if (!req.body.todos) {
            req.body.todos = []
        }
        if (typeof req.body.todos === 'string') {
            req.body.todos = [req.body.todos]
        }
        if (!req.body.members) {
            req.body.members = []
        }
        if (typeof req.body.members === 'string') {
            req.body.members = [req.body.members]
        }
        req.body.todos.forEach(async todo => {
            let newTodo = new Todo({
                name: todo,
                status: false
            })
            try {
                arrTodos.push(newTodo._id)
                await newTodo.save()
            } catch (error) {
                next(error)
            }
        })
        let newProject = new Project({
            title: req.body.title,
            owner: req.loggedUser.id,
            todos: arrTodos,
            members: req.body.members,
            deadline: req.body.deadline,
            progress: 0
        })
        try {
            res.json(await newProject.save())
        } catch (error) {
            next(error)
        }
    }

    static async getOne(req, res, next) {
        try {
            let result = await Project.findById(req.params.projectId)
                .populate('todos')
                .populate('members')
                .populate('owner')
            if (result) {
                let done = 0
                result.todos.forEach(todo => {
                    if (todo.status) {
                        done++
                    }
                })
                result.progress = done
                res.json(result)
            } else {
                throw ({
                    code: 404,
                    message: "project not found"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async addMember(req, res, next) {
        console.log('masuk');
        console.log(req.body);
        console.log(typeof req.body.members);
        if (typeof req.body.members === 'string') {
            req.body.members = [req.body.members]
        }
        console.log(req.body.members);
        try {
            let result = await Project.findById(req.params.projectId)
            if (result) {
                req.body.members.forEach(async memberId => {
                    if (result.members.indexOf(memberId) === -1) {
                        result.members.push(memberId)
                    }
                })
                res.json(await result.save())
            } else {
                throw ({
                    code: 404,
                    message: "project not found"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async removeMember(req, res, next) {
        try {
            let result = await Project.findById(req.params.projectId)
            if (result) {
                let memberIndex = result.members.indexOf(req.params.memberId)
                if (memberIndex === -1) {
                    throw ({
                        code: 400,
                        message: `member ${req.params.memberId} does not exist in this project`
                    })
                } else {
                    result.members.splice(req.params.memberId, 1)
                    res.json(await result.save())
                }
            } else {
                throw ({
                    code: 404,
                    message: "project not found"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async addTodo(req, res, next) {
        try {
            let result = await Project.findById(req.params.projectId)
            if (result) {
                let newTodo = new Todo({
                    name: req.body.todoName,
                    status: false
                })
                result.todos.push(newTodo._id)
                await newTodo.save()
                res.json(await result.save())
            } else {
                throw ({
                    code: 404,
                    message: "project not found"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async removeTodo(req, res, next) {
        try {
            let result = await Project.findById(req.params.projectId)
            if (result) {
                let index = (result.todos.indexOf(req.params.todoId))
                if (index == -1) {
                    throw ({
                        code: 400,
                        message: "todo does not exist"
                    })
                } else {
                    result.todos.splice(index, 1)
                    res.json(await result.save())
                }
            } else {
                throw ({
                    code: 404,
                    message: "project not found"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async removeProject(req, res, next) {
        try {
            let del = await Project.findByIdAndDelete(req.params.projectId)
            if (del) {
                res.json(del)
            } else {
                throw ({
                    code: 404,
                    message: "project not found"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async updateProject(req, res, next) {
        let updated = {}
        let projectId = req.params.projectId
        req.body.title && (updated.title = req.body.title)
        req.body.deadline && (updated.deadline = req.body.deadline)
        try {
            let project = await Project.findByIdAndUpdate(projectId, updated, {
                new: true
            })
            if (project) {
                res.json(project)
            } else {
                throw ({
                    code: 404,
                    message: "project not found"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async toggleTodoStatus(req, res, next) {
        try {
            let todo = await Todo.findById(req.params.todoId)
            if (todo) {
                todo.status = !todo.status
                res.json(await todo.save())
            } else {
                throw ({
                    code: 404,
                    message: "todo not found"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static async updateTodoName(req, res, next) {
        try {
            let todo = await Todo.findById(req.params.todoId)
            if (todo) {
                todo.name = req.body.todoName
                res.json(await todo.save())
            } else {
                throw ({
                    code: 404,
                    message: "todo not found"
                })
            }
        } catch (error) {
            next(error)
        }
    }

}

module.exports = projectController