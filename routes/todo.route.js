const router = require('express').Router()
const todoController = require('../controllers/todo.controller')

router.get('/', todoController.list)
router.get('/:id', todoController.detail)
router.post('/', todoController.create)
router.delete('/:id', todoController.delete)
router.patch('/:id', todoController.update)

module.exports = router