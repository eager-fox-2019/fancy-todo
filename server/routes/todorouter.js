const router = require('express').Router()
const TodoController = require('../controllers/todocontroller')
const {authentication} = require('../middlewares/authentication')
const {authorization} = require('../middlewares/authorization')

router.get('/findtodos', authentication, TodoController.findTodos)
router.get('/findtodos/checked', authentication, TodoController.findChecked)

router.get('/findone/:id', authentication, TodoController.findOneTodo)
router.post('/add', authentication, TodoController.addTodo)
router.post('/upload', authentication, TodoController.uploadImgur)

// router.use('/:id', authorization)
router.delete('/delete/:id', authentication, authorization,TodoController.deleteTodo)
router.patch('/checked/:id', authentication, authorization, TodoController.checkTodo)
router.patch('/update/:id', authentication, authorization, TodoController.patchTodo)


module.exports = router