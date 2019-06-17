const express = require('express')
const router = express.Router()
const todo = require('../controllers/todo')
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorizationTodo')

router.use(authentication)
router.get('/', todo.findAll)
router.get('/:id', todo.findOne)
router.get('/status/:status', todo.navStatus)
router.post('/', todo.create)
router.patch('/:id', authorization, todo.patch)
router.delete('/:id', authorization, todo.delete)

module.exports = router