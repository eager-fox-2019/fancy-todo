const express = require('express');
const routes = express.Router();
const TodoController = require('../controllers/TodoController')
const authorize = require('../middlewares/authorize')

routes.post('/', TodoController.create)
routes.get('/', TodoController.findBelongs)
routes.get('/search',authorize,  TodoController.search)
routes.put('/:id', authorize, TodoController.update)
routes.patch('/:id', authorize, TodoController.update)
routes.delete('/:id', authorize, TodoController.delete)

module.exports = routes