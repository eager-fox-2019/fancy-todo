const express = require('express');
const routes = express.Router();
const todos = require('./todoRoute')
const users = require('./userRoute')
const projects = require('./projectRoute')
const apiRoutes = require('./apiRoutes')
const authentication = require('../middlewares/authentication')

routes.use('/opens', apiRoutes)
routes.use('/users', users)
routes.use('/todos', authentication, todos)
routes.use('/projects', authentication, projects)

routes.get('*', (req, res) => {
    res.status(404).json({msg: 'Page not found'})
})

module.exports = routes