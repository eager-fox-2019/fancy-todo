const router = require('express').Router()
const todoController = require('../controller/todoController')
const todoAuthorization = require('../middlewares/authorization')
//path https://localhost/todo

router.get('/', todoController.findAll)
router.get('/:todoId', todoController.findOne)
router.post('/', todoController.create)
router.patch('/:todoId', todoAuthorization, todoController.update)
router.delete('/:todoId', todoAuthorization, todoController.delete)

module.exports = router