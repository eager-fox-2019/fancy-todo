const { verify } = require('../helpers/jwt')
const Todo = require('../models/todo')

module.exports = (req, res, next) => {
    let accessToken = verify(req.headers["access-token"])
    Todo
        .findOne({ _id: req.params.id })
        .then((findOneTodo) => {
            if (String(findOneTodo.userId) == accessToken.id) {
                next()
            }
            else {
                res.status(401).json(
                { type: 'AUTHORIZATION ERROR', 
                message: 'You do not have access!' }
                )
            }
        })
}