const router = require('express').Router()
const controllerUser = require('../controllers/controlUsers')
const isAuthenticated = require('../middleware/auth.js').authentication
const isAuthorized = require('../middleware/auth.js').authorization

// /api/users
router.get('/', controllerUser.findAll)
router.post('/register', controllerUser.create)
router.post('/login', controllerUser.login)
// router.post('/googleSignin', ControllerUser.googleSignin)

router.patch('/update', isAuthenticated, controllerUser.update)
router.delete('/delete', isAuthenticated, controllerUser.delete)

module.exports = router