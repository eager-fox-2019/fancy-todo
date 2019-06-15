const router = require('express').Router()
const userRouter = require('./userrouter')
const todoRouter = require('./todorouter')

router.use('/user', userRouter)
router.use('/todo', todoRouter)

module.exports = router