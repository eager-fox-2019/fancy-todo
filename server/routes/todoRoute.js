const router = require('express').Router()
const todoController = require('../controllers/todoController')
const {authentication} = require('../middlewares/auth')

router.use(authentication)
router.get('/', todoController.findPersonal)
router.post('/', todoController.create)
router.patch('/:todoId', todoController.update)
router.delete('/:todoId', todoController.delete)
// router.get('/get', todoController.findAll)

module.exports = router