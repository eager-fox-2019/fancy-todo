const express = require('express')
const router = express.Router()
const todoController = require('../Controllers/todoController')

router.post('/create', todoController.create)
router.get('/search', todoController.findAll)
router.delete('/delete/:todoId', todoController.delete)
router.patch('/update/:todoId', todoController.patch)


module.exports = router