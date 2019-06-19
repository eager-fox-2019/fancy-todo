const router = require('express').Router()
const Users = require('./user')
const Todos = require('./todo')

router.use('/api/user', Users)
router.use('/api/todo', Todos)

module.exports = router