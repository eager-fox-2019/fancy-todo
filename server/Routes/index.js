const express = require('express')
const router = express.Router()

//require to child router
const userRouter = require('./userRouter')
const todoRouter = require('./todoRouters')

//authentication
const {Authentication} = require('../middleware/auth')

//router use
router.use('/user', userRouter)

router.use('/todo', Authentication,todoRouter)

module.exports = router