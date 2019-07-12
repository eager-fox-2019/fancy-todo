const router = require('express').Router()
const userController = require('../controllers/user')

router.post('/login',userController.signIn)
router.post('/register',userController.signUp)
router.post('/google',userController.gSignIn)

module.exports = router