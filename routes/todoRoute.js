const router = require('express').Router()
const todoController = require('../controllers/todoController')
const {authentication} = require('../middlewares/auth')

router.use(authentication)
router.get('/', todoController.findAll)
router.post('/create', todoController.create)
router.patch('/edit/:todoId', todoController.update)
router.delete('/delete/:todoId', todoController.delete)

module.exports = router