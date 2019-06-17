const express = require('express')
const todoRouter = express.Router()
const TodoController = require('../controllers/todoController')
const authentication = require('../middlewares/authentication')

todoRouter.use(authentication)
todoRouter.get('/',TodoController.showList)
todoRouter.post('/',TodoController.create)
todoRouter.delete('/:todoid',TodoController.delete)
todoRouter.get('/:todoid',TodoController.findOneTodo)
todoRouter.put('/:todoid',TodoController.update)
todoRouter.patch('/:todoid',TodoController.updateStatus)
todoRouter.get('/search/:search',TodoController.search)

module.exports = todoRouter