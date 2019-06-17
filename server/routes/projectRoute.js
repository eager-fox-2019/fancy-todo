const Route = require('express').Router()
const projectController = require('../controllers/projectController')
const isLogin = require('../middlewares/authenticate')
const isProjectOwner = require('../middlewares/authorizeProject')
// const isMember = require('../middlewares/authorizeMember')

Route.post('/', isLogin, projectController.create)
Route.get('/:memberId', isLogin, projectController.read)
Route.put('/:id', isLogin, isProjectOwner, projectController.update)
Route.delete('/:id', isLogin, isProjectOwner, projectController.delete)

Route.put('/addmember/:projectId', isLogin, projectController.addmember)

module.exports = Route