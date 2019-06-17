const Project = require('../models/project')
const User = require('../models/user')

module.exports = (req, res, next) => {
    let userId = null;
    User.findOne({ _id : req.user.id})
    .then((user) => {
        if(!user){
            res.status(500).json({message: 'User not Found'})
        }
        userId = user._id
        return Project.findById(req.params.id)
    })
    .then((project) => {
        console.log(project);
        if (project.members.indexOf(userId) >= 0) {
            console.log(project.members.indexOf(userId) >= 0);
            next()
        } else {
            res.status(500).json({message: 'user is not a member!'})
        }
    })
}