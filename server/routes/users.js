const router = require('express').Router()
const controllerUser = require('../controllers/controlUsers')
const isAuthenticated = require('../middleware/auth.js').authentication
const isAuthorized = require('../middleware/auth.js').authorization

// /api/users
router.get('/', controllerUser.findAll)
router.post('/register', controllerUser.create)
router.post('/login', controllerUser.login)
router.post('/googleSignin', controllerUser.googleSignin)
router.post('/fblogin', controllerUser.fbSignin)

router.get('/current', isAuthenticated, controllerUser.current)
router.patch('/update', isAuthenticated, controllerUser.update)
router.delete('/delete', isAuthenticated, controllerUser.delete)

// router.delete('/forceDelete/:userId', controllerUser.delById)

module.exports = router