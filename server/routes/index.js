const express = require('express')
const router = express.Router()
const users = require('./user')
const todo = require('./todo')
const {isUser, isAuthorize} = require('../middlewares/auth')

router.use('/users', users)
router.use('/todos', isUser, todo)

module.exports = router