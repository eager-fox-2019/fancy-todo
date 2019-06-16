const router = require('express').Router()
const userController = require('../controllers/userController.js')

router.use('/users', require('./userRoutes'))
router.use('/projects', require('./projectRoutes'))
router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/google', userController.googleLogin)

module.exports = router