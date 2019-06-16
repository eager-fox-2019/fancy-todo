const router = require('express').Router()
const Todos = require('../controllers/todo')
const { auth, authorization } = require('../middlewares/access')

router.use(auth)
router.post('/create', Todos.create)
router.get('/list', Todos.listByUId)
router.post('/update/:id', authorization, Todos.update)
router.delete('/delete/:id', authorization, Todos.delete)

module.exports = router