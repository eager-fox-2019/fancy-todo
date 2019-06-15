const router = require('express').Router()
const todoController = require('../controllers/todoController')

router.get('/', todoController.findAll)
router.post('/create', todoController.create)
router.patch('/edit', todoController.edit)
router.delete('/delete', todoController.delete)

module.exports = router