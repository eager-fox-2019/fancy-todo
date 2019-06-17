const express = require('express')
const router = express.Router()

const ControllerUser = require('../controllers/ControllerUser')
const { authentication } = require('../middlewares/author_authen')

router.post('/login', ControllerUser.login)
router.post('/logout', ControllerUser.logout)
router.post('/register', ControllerUser.register)
router.get('/myprofile', authentication, ControllerUser.profileData)

module.exports = router