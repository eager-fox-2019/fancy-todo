const router = require('express').Router()
const todoController = require('../controllers/todo')
const {authenticate} = require('../middlewares/authenticate')
const authorization = require('../middlewares/authorization')

router.use(authenticate)
router.get('/',todoController.readTodo)
router.get('/finish',todoController.readFinishTodo)
router.get('/unfinish',todoController.readUnfinishTodo)
router.get('/:id',authorization,todoController.showOneTodo)
router.patch('/finish/:id',todoController.finishTodo)
router.patch('/unfinish/:id',todoController.unfinishTodo)
router.post('/',todoController.createTodo)
router.put('/:id',authorization,todoController.updateTodo)
router.delete('/:id',authorization,todoController.deleteTodo)

module.exports = router