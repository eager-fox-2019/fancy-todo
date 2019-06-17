const router = require('express').Router()
const UserController = require('../controllers/user')

router.get('/',UserController.getAll)
router.get('/:id',UserController.getOne)
router.post('/register',UserController.register)
router.post('/login',UserController.login)
router.patch('/:id',UserController.update)
router.delete('/:id',UserController.delete)
router.post('/loginGoogle', UserController.loginGoogle)

module.exports = router