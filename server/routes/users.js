const router = require('express').Router()
const ControllerUser = require('../controllers/controlUsers')
// /api/users
router.get('/', ControllerUser.findAll)
// router.post('/register', ControllerUser.create)
// router.post('/login', ControllerUser.login)
// router.post('/googleSignin', ControllerUser.googleSignin)

// const isAuthenticated = require('../middlewares/authentication')
// router.post('/addFav/:eventId', isAuthenticated, ControllerUser.addFav)
// router.get('/getFav', isAuthenticated, ControllerUser.getFav)
// router.delete('/delFav/:favId', isAuthenticated, ControllerUser.delFav)


module.exports = router