const Todo = require('../models/todoModel');
const User = require('../models/userModel')
const { verifyToken } = require('../helpers/jwt')
module.exports = function (req, res, next) {
    try {
        let decoded = verifyToken(req.headers.token);
        User.findOne({
            email: decoded.email
        })
            .then(user => {
                return Todo.findById(req.params.id)
                    .then((todos) => {
                        console.log('masuk auth todo')
                        if (user.id == todos.owner) {
                            next()
                        } else {
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