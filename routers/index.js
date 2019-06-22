const router = require('express').Router()
const todoRoutes = require('./todo')
const userRoutes = require('./user')

router.use('/user',userRoutes)
router.use('/todo',todoRoutes)

module.exports = router