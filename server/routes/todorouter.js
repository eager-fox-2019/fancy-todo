const router = require('express').Router()
const TodoController = require('../controllers/todocontroller')
const {authentication} = require('../middlewares/authentication')

router.get('/findtodos', authentication, TodoController.findTodos)
router.get('/findtodos/checked', authentication, TodoController.findChecked)

router.get('/findone/:id', authentication, TodoController.findOneTodo)
router.post('/add', authentication, TodoController.addTodo)
router.post('/upload', authentication, TodoController.uploadImgur)
router.delete('/delete/:id', authentication, TodoController.deleteTodo)

router.patch('/checked/:id', authentication, TodoController.checkTodo)
router.patch('/update/:id', authentication, TodoController.patchTodo)


//AUTHORIZATION

module.exports = router