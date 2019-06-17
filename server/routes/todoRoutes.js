const router = require('express').Router()
const TodoController = require('../controllers/todoController')

router.get('/readAll', TodoController.readAll)
router.post('/add', TodoController.add)
router.delete('/:id', TodoController.delete)
router.put('/:id', TodoController.update)

module.exports = router