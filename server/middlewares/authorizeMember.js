const Project = require('../models/projectModel');
const User = require('../models/userModel')
const { verifyToken } = require('../helpers/jwt')

module.exports = function (req, res, next) {
    try {
        let decoded = verifyToken(req.headers.token);
        User.findOne({
            email: decoded.email
        })
            .then(user => {
                return Project.findById(req.params.projectId)
                    .then((project) => {
                        let flag = true
                        project.member.forEach(element => {
                            if (user.id == String(element)) {
                                flag = false
                                next()
                            }
                        });
                        if (flag){
                            next({ status: 400, messages: 'You dont have access' })
                        }                                
                    })
            })
            .catch(err => {
                res.status(404).json({ msg: err.message })
            })
    } catch (error) {
        throw 'You dont have access'
    }
} 