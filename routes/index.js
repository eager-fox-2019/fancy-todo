const todo = require('./todo.route')
const user = require('./user.route')
const router = require('express').Router() 
const authMiddleware = require('../middlewares/authentication.middleware')

router.use('/user', user)
router.use('/todo', authMiddleware, todo)

module.exports = router