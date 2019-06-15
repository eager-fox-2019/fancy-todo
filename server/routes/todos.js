const router = require('express').Router()
const ControllerTodos = require('../controllers/controlTodos')
// /api/todos
router.get('/', ControllerTodos.findAll)
router.post('/add', ControllerTodos.create)

module.exports = router