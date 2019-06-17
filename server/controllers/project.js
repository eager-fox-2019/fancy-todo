const Project = require('../models/project')

class ProjectController{

    static getAll(req,res,next){
        Project
        .find({},{},{
            sort: {
                _id: -1
                }
        })
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static getOne(req,res,next){
        Project
        .findById(req.params.id)
        .populate('projectMaker')
        .populate('projectMembers')
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static getMembers(req, res, next) {

    }

    static create(req,res,next){
        let newProject = {
            projectName: req.body.projectName,
            projectMaker: req.loggedUser.id,
            projectMembers: [req.loggedUser.id]
        }
        Project
            .create(newProject)
            .then(data =>{
                res.status(200).json(data)
            })
            .catch(next)
    }

    static update(req,res,next){
        let setVal = {}
        req.body.projectName && (setVal.projectName = req.body.projectName)
        req.body.projectMaker && (setVal.projectMaker = req.body.projectMaker)
        req.body.projectMembers && (setVal.projectMembers = req.body.projectMembers)
        Project
        .findById(req.params.id)
        .then(project =>{
            project.set(setVal)
            return project.save()
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req,res,next){
        Project
        .findByIdAndDelete(req.params.id)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

}

module.exports = ProjectController