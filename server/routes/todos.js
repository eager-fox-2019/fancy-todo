const router = require('express').Router()
const ControllerTodos = require('../controllers/controlTodos')
const isAuthenticated = require('../middleware/auth.js').authentication
const isAuthorized = require('../middleware/auth.js').authorization

// /api/todos
router.get('/', isAuthenticated, ControllerTodos.findAll)
router.post('/add', isAuthenticated, ControllerTodos.create)
router.patch('/update/:userId/:id', isAuthorized, ControllerTodos.update)
router.delete('/del/:userId/:id', isAuthorized, ControllerTodos.delete)

module.exports = router