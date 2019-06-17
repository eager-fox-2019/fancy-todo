const Router = require('express').Router()
const userRoute = require('./user')
const todoRoute = require('./todo')
const projectRoute = require('./project')
const {authenticate} = require('../middlewares/auth')

Router.get('/', (req, res) => {res.status(200).json({message: 'Home'})})

Router.use('/users', userRoute)

Router.use(authenticate)

Router.use('/todos', todoRoute)
Router.use('/projects', projectRoute)




module.exports = Router