const Project = require('../models/projectModel')

class ProjectController {
    static create(req, res, next){
        let { name, member, owner } = req.body
        Project.create({
            name, member, owner
        })
        .then((newProject) => {
            res.status(201).json(newProject)
        })
        .catch(next)
    }

    static update(req, res, next){
        let id = req.params.id
        let dataUpdate = req.body
        Project.findByIdAndUpdate(id, dataUpdate, {new:true})
        .then((updated) => {
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static addmember(req, res, next){
        let id = req.params.projectId
        let newMember = req.body.member
        Project.findById(id)
        .then((project) => {
            let flag = true
            project.member.forEach(element => {
                if (newMember == String(element)) {
                    flag = false
                    next({ status: 400, messages: 'already member of this project' })
                }
            });
            if (flag){
                let members = project.member
                members.push(newMember)
                return Project.findByIdAndUpdate(id, {member: members}, {new:true})
                .then((updated) => {
                    res.status(200).json(updated)
                })            
            }       
        })
        .catch(next)
    }

    static read(req, res, next){
        Project.find({})
        .populate('member')
        .populate('owner')
        .then((projects) => {
            let memberId = req.params.memberId
            let newProjects = []
            projects.forEach(el => {
                el.member.forEach(element => {
                    if(element._id == memberId) {
                        newProjects.push(el)
                    }    
                })
            })
            res.status(200).json(newProjects)
        })
        .catch(next)
    }

    static delete(req, res, next){
        let id = req.params.id
        Project.findByIdAndDelete(id)
        .then((deleted) => {
            res.status(200).json(deleted)
        })
        .catch(next)
    }
}

module.exports = ProjectController