const Route = require('express').Router()
const TodoController = require('../controllers/todoController')
const isLogin = require('../middlewares/authenticate')
const isOwner = require('../middlewares/authorizeTodo')
const isMember = require('../middlewares/authorizeMember')

Route.get('/', isLogin, TodoController.read)
Route.get('/:owner', isLogin, TodoController.readMyTodo)
Route.get('/find/:id', isLogin, TodoController.readOne)
Route.post('/',isLogin, TodoController.create)
Route.put('/:id', isLogin, TodoController.update)
Route.patch('/:id', isLogin, TodoController.update)
Route.delete('/:id', isLogin, isOwner, TodoController.delete)
Route.delete('/:id/:projectId', isLogin, isMember, TodoController.delete)

// Route.get('/projects/:projectId', TodoController.findTodoProject)


module.exports = Route