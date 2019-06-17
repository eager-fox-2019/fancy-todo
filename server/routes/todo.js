const router = require("express").Router()
const todo = require('../controllers/todo')
const { authTodo } = require('../middlewares/authorize')
const authenticate = require('../middlewares/authenticate')

router.use(authenticate)

router.post('/', todo.create)
router.get('/', todo.read)
router.get('/:id', authTodo, todo.readOne)
router.put('/:id', authTodo, todo.update)
router.patch('/:id', authTodo, todo.update)
router.delete('/:id', authTodo, todo.delete)

module.exports = router