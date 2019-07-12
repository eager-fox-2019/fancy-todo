const Project = require('../models/project')
const Todo = require('../models/todo')
const User = require('../models/user')

class ProjectController {
    static create(req, res) {
        Project
            .create({
                name : req.body.name,
                createdBy : req.user.id,
                members : [req.user.id]
            })
            .then((data) => {
                res.status(201).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static showAll(req, res) {
        console.log(req.user)
        Project
        .find({ members : { $in : req.user.id}})
        .populate({
            path : 'todoList',
            model : 'Todo',
            populate : {
                path : 'userId',
                model : 'User'
            }
        })
        .populate('members')
        .populate('pendingMembers')
        .populate('createdBy')
        .then((projects) => {
            res.status(200).json(projects)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    }

    static showOne(req, res) {
        Project
        .findById(req.params.id)
        .populate({
            path : 'todoList',
            model : 'Todo',
            populate : {
                path : 'userId',
                model : 'User'
            }
        })
        .populate('members')
        .populate('pendingMembers')
        .populate('createdBy')
        .then((projects) => {
            res.status(200).json(projects)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    }

    static delete(req, res) {
        Project
            .findByIdAndDelete({_id : req.params.id})
            .then((data) => {
                return Todo
                        .deleteMany({
                            projectId : data._id
                        })
            })
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            })
    }
    
    static addProjectsTodo(req, res) {
        let {title, description, dueDate, category} = req.body
        User
            .findOne({ email : req.user.email})
            .then((user) => {
                return Todo
                        .create({
                            title, description, dueDate, category ,projectId:req.params.id, userId : user._id
                        })
            })
            .then((data) => {
                return Project
                        .findByIdAndUpdate({
                            _id : req.params.id
                        }, {
                            $push : { todoList : data._id}
                        },{new:true})      
            })
            .then((result) => {
                res.status(201).json({result, message:'Sucess added todo to project'})
            })
            .catch((err) => {
                res.status(500).json(err)  
            })
    }

    static inviteMember(req, res) {
        let foundUser = null;
        User
        .findOne({ email : req.body.email})
        .then((user) => {
            if(!user){
                res.status(404).json({message:'Users Not Found'})
            }
            foundUser = user
            return Project
                    .findById(req.params.id)
        })
        .then((project) => {
            let checkMember = project.members.indexOf(foundUser._id) < 0
            let checkPendingMember = project.pendingMembers.indexOf(foundUser._id) < 0
            if (checkMember && checkPendingMember) {
                 return  Project
                            .findByIdAndUpdate({ _id : req.params.id}, { $push : { pendingMembers : foundUser._id}},{
                                new:true})
            } else if (!checkMember) {
                 res.status(400).json({message : 'user already a member'})
            } else if (!checkPendingMember) {
                 res.status(400).json({message : 'user already invited'})
            }
        })
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            res.status(500).json(err)  
        })
    }

    static showPendingMember(req, res) {
        Project
            .find({
                pendingMembers : { $in : req.user.id}
            })
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static joinProject(req, res) {
        Project
            .findByIdAndUpdate({_id : req.params.id},{
                $pull : { pendingMembers : req.user.id },
                $push : { members : req.user.id}
            },{new:true})
            .then((data) => {
                res.status(200).json(data)  
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static declineProject(req, res) {
        Project
        .findByIdAndUpdate({_id : req.params.id},{
            $pull : { pendingMembers : req.user.id }
        },{new:true})
        .then((data) => {
            res.status(200).json(data)  
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    }

    static update(req, res) {
        Project
        .findByIdAndUpdate({_id : req.params.id}, req.body,{
            new:true
        })
        .then((data) => {
            res.status(200).json(data)  
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err)
        })
    }
}

module.exports = ProjectController