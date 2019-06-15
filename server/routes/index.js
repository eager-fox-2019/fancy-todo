const router = require('express').Router()
const userRoutes = require('./users')
const todosRoutes = require('./todos')

router.use('/users', userRoutes)
router.use('/todos', todosRoutes)

module.exports = router