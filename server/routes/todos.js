const router = require('express').Router()
const ControllerTodos = require('../controllers/todos')
const isAuthenticated = require('../middlewares/authentication')

// api/todos

router.get('/', ControllerTodos.findAll)
router.use(isAuthenticated)
router.get('/:id', ControllerTodos.findById)
router.post('/', ControllerTodos.create)
router.delete('/:id', ControllerTodos.delete)
router.patch('/:id', ControllerTodos.update)
router.patch('/status/:id', ControllerTodos.updateStatus)



module.exports = router