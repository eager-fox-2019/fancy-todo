const router = require('express').Router()
const userController = require('../controllers/userController')
// const {authentication} = require('../middlewares/auth')

router.post('/google', userController.googleLogin)
// router.use(authentication)
router.post('/create', userController.register)
router.post('/login', userController.login)
router.get('/get', userController.findAll)

module.exports = router