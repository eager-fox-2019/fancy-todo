const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todoController')
const {isUser, isAuthorize} = require('../middlewares/auth')


router.get('/',todoController.readAll)
router.post('/',todoController.create)
router.get('/showTips',todoController.showYoutube)
router.patch('/:id',isAuthorize,todoController.update)
router.delete('/:id',isAuthorize,  todoController.delete)
router.get('/:id', todoController.readOne)

module.exports = router