const express = require('express')
const router = express.Router()
const userRoutes = require('./userRoute')
const todoRoutes = require('./todoRoute')

router.use('/user', userRoutes)
router.use('/todo', todoRoutes)

module.exports = router