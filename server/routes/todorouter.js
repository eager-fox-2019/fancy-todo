const router = require('express').Router()
const TodoController = require('../controllers/todocontroller')
const {authentication} = require('../middlewares/authentication')

router.get('/findtodos', authentication, TodoController.findTodos)
router.post('/add', authentication, TodoController.addTodo)
router.delete('/delete', authentication, TodoController.deleteTodo)
router.patch('/checked', authentication, TodoController.checkTodo)

module.exports = router