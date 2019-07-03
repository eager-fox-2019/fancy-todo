const router= require('express').Router()
const userRoute= require('./user')
const todoRoute= require('./todo')

router.use('/users', userRoute)
router.use('/todos', todoRoute)


module.exports= router