const router = require("express").Router()
const todo = require('../controllers/todo')
const authorize = require('../middlewares/authorize')
const authenticate = require('../middlewares/authenticate')

router.use(authenticate)

router.post('/', todo.create)
router.get('/', todo.read)
router.get('/:id', authorize, todo.readOne)
router.put('/:id', authorize, todo.update)
router.patch('/:id', authorize, todo.update)
router.delete('/:id', authorize, todo.delete)

module.exports = router