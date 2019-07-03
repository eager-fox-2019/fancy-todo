const router= require('express').Router()
const userController= require('../contollers/user')

router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/loginGoogle', userController.loginGoogle)


module.exports= router