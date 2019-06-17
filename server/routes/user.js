const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

router.post('/login', UserController.login)
router.post('/loginGoogle', UserController.loginGoogle)
router.post('/register', UserController.register)

module.exports = router