const Todo = require('../models/todo')

module.exports = (req, res, next) => {
    if(req.headers.hasOwnProperty('token')) {
        Todo.findOne({userId:req.params.id})
        .then((todo) => {
            if(todo) {
                if(todo.userId==req.decoded.id) {
                    next()
                }else{
                    res.status(403).json({ err: 'Forbidden' })
                }
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }else {
        res.status(400).json({'msg': 'Not authorize'})
    }
}