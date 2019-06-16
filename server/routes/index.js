const router = require('express').Router()
const userRoutes = require('./userRoutes')
const todoRoutes = require('./todoRoutes')
const { authenticate } = require('../middleware/auth')

router.use('/users', authenticate, userRoutes)
router.use('/todos', todoRoutes)

module.exports = router