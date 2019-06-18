const express = require('express');
const routes = express.Router();
const UserController = require('../controllers/UserController')

routes.get('/', UserController.list)
routes.post('/signup', UserController.signup)
routes.post('/signin', UserController.signin)
routes.post('/googlesignin', UserController.signInGoogle)
routes.get('/:todoId', UserController.findUserTodo)

module.exports = routes