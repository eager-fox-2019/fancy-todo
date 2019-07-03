const router = require('express').Router()
const userRouter = require('./userRouter')
const todoRouter = require('./todoRouter')
const tagRouter = require('./tagRouter')
const groupingRouter = require('./groupingRouter')
const userController = require('../controller/userController')
const authentication = require('../middlewares/authentication')

router.post('/signin', userController.signin)
router.post('/signup', userController.signup)
router.post('/googleSignin', userController.googleSignIn)

router.use(authentication)
router.get('/authentication', userController.authentication)
router.use('/grouping',groupingRouter)
router.use('/tag',tagRouter)
router.use('/todo',todoRouter)
router.use('/user', userRouter)



module.exports = router