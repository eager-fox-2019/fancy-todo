const Project = require('../models/project.js')
const User = require("../models/user.js")

class Controller {
  static create(req, res, next) {
    Project.create({
      name: req.body.name,
      creator: req.userData.id,
      members: [req.userData.id],
    })
    .then(project => {
      res.status(201).json(project)
    })
    .catch(next)
  }
  
  static findAll(req, res, next) {
    Project.find({
      members: req.userData.id
    })
    .populate('creator')
    .populate('members')
    .exec()
    .then(projects => {
      res.json(projects)
    })
    .catch(next)
  }
  
  static findOne(req, res, next) {
    Project.findById(req.params.id)
    .populate('creator')
    .populate('members')
    .exec()
    .then(project => {
      res.json(project)
    })
    .catch(next)
  }

  static newTodo(req, res, next) {
    Project.findById(req.params.id)
      .populate('creator')
      .populate('members')
      .exec()
      .then(project => {
        project.todos.push({
          title: req.body.title,
          description: req.body.description,
          dueDate: req.body.dueDate,
          owner: req.userData.id,
        })
        return project.save()
      })
      .then(project => {
        res.status(201).json(project)
      })
      .catch(next)
  }

  static deleteTodo(req, res, next) {
    Project.findById(req.params.id)
      .populate('creator')
      .populate('members')
      .exec()
      .then(project => {
        project.todos.id(req.params.todoid).remove()
        return project.save()
      })
      .then(project => {
        res.status(200).json(project)
      })
      .catch(next)
  }

  static updateTodo(req, res, next) {
    Project.findById(req.params.id)
      .populate('creator')
      .populate('members')
      .exec()
      .then(project => {
        let updates = Object.assign({}, req.body)
        project.todos.id(req.params.todoid).set(updates)
        return project.save()
      })
      .then(project => {
        res.status(200).json(project)
      })
      .catch(next)
  }
  
  static delete(req, res, next) {
    Project.findByIdAndDelete(req.params.id)
    .exec()
    .then(() => {
      res.status(204).end()
    })
    .catch(next)
  }
  
  static addMember(req, res, next) {
    User.findOne({ email: req.body.email })
      .exec()
      .then(user => {
        if(!user) {
          res.status(404).end()
        }
        else {
          // 'addToSet' only adds if not already in, prevents duplicates
          Project.findByIdAndUpdate(req.params.id,
            { $addToSet: { members: user._id } },
            { new: true },
          )
            .populate('creator')
            .populate('members')
            .exec()
            .then(project => {
              res.json(project)
            })
            .catch(next)
        }
      })
      .catch(next)
  }

  static removeMember(req, res, next) {
    Project.findById(req.params.id)
      .populate('members')
      .exec()
      .then(project => {
        let uid = null;
        for(let member of project.members) {
          if(req.body.email === member.email) {
            uid = member._id
          }
        }
        if(uid) {
          return Project.findByIdAndUpdate(req.params.id,
            { $pull: { members: uid } },
            { new: true },
          )
            .populate('creator')
            .populate('members')
            .exec()
        } else {
          throw { status: 404, msg: "Email not found in project" }
        }
      })
      .then(project => {
        res.json(project)
      })
      .catch(next)
  }
}

module.exports = Controller