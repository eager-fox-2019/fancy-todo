const Route = require('express').Router()
const UserController = require('../controllers/userController')

Route.get('/', UserController.getUsers)
Route.post('/register', UserController.register)
Route.post('/login', UserController.login)
Route.get('/unique/:email', UserController.cekEmail)

module.exports = Route