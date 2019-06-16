const route = require('express').Router();
const todoController = require('../controllers').todo;
const {authentication, authorization} = require('../middlewares');

route.post('/create', authentication,todoController.create);
route.get('/read/all', authentication, todoController.getTodo);
route.get('/read/one/:todoId', authentication, todoController.getTodoById);
route.patch('/update/:todoId', authentication, authorization, todoController.update);
route.delete('/delete/:todoId', authentication, authorization, todoController.delete);

module.exports = route;