const router = require('express').Router()
const todoController = require('../controllers/todoController')

router.get('/findAll',todoController.allTodo)
router.get('/findOne/:id',todoController.detail)
router.post('/',todoController.create)
router.patch('/:taskId',todoController.update)
router.delete('/:taskId',todoController.remove)

module.exports = router