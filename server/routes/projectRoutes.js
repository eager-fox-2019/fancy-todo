const projectController = require('../controllers/projectController')
const router = require('express').Router()
const {
    Authenticate
} = require("../middleware/authentication")
const {
    AuthorizeRead
} = require('../middleware/authentication')
const {
    AuthorizeDelete
} = require('../middleware/authentication')

router.use('/', Authenticate)

router.get('/', projectController.getAll)
router.get('/:projectId', AuthorizeRead, projectController.getOne)

router.post('/', projectController.create)
router.post('/:projectId/todos', AuthorizeRead, projectController.addTodo)
router.post('/:projectId/members', AuthorizeRead, projectController.addMember)

router.delete('/:projectId', AuthorizeDelete, projectController.removeProject)
router.delete('/:projectId/members/:memberId', AuthorizeRead, projectController.removeMember)
router.delete('/:projectId/todos/:todoId', AuthorizeRead, projectController.removeTodo)

router.patch('/:projectId', AuthorizeDelete, projectController.updateProject)
router.patch('/:projectId/todos/:todoId', AuthorizeRead, projectController.updateTodoName)
router.patch('/:projectId/todos/:todoId/toggle', AuthorizeRead, projectController.toggleTodoStatus)

module.exports = router