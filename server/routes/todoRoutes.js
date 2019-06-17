const router = require('express').Router()
const TodoController = require('../controllers/todoController')
const authenticate = require('../middlewares/middleware')

router.get('/readAll', TodoController.readAll)
router.use('/', authenticate)
router.post('/add', TodoController.add)
router.delete('/:id', TodoController.delete)
router.put('/:id', TodoController.update)

module.exports = router