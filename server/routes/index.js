const express = require('express')
const router = express.Router()

const routerUser = require('./user')
const routerTask = require('./task')

router.use('/user', routerUser)
router.use('/task', routerTask)

module.exports = router