const router = require('express').Router()
const user = require('../controllers/user')

router.post('/register', user.register)
router.post('/login', user.login)
router.post('/signingoogle', user.GoogleSignIn)

module.exports = router