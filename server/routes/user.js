const express = require('express')
const router = express.Router()
const user = require('../controllers/user')

router.post('/signup', user.register)
router.post('/signin', user.login)
router.post('/googlesignin', user.googlesignin)

module.exports = router