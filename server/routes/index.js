const Route = require('express').Router()
const UserRoute = require('./userRoute')
const TodoRoute = require('./todoRoute')
const ProjectRoute = require('./projectRoute')
const googleSignIn = require('../controllers/googleSignInController')

Route.use('/users', UserRoute)
Route.use('/todos', TodoRoute)
Route.use('/projects', ProjectRoute)

Route.post('/googleSignIn', googleSignIn.loginFromGoogle)

module.exports = Route