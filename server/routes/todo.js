const router = require('express').Router()
const TodoController = require('../controllers/todo')
const {authorizeTodo} = require('../middlewares/auth')

router.get('/',TodoController.getAll)
router.get('/:id',TodoController.getOne)
router.post('/',TodoController.create)

router.patch('/:id',authorizeTodo, TodoController.update)
router.delete('/:id',authorizeTodo, TodoController.delete)

module.exports = router