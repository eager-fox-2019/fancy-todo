const router = require('express').Router()
const UserController = require('../controllers/usercontroller')

router.post('/signup', UserController.signUp)
router.post('/signin', UserController.signIn)
router.post('/googlesign', UserController.googleToken)

module.exports = router
