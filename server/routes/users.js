const router = require('express').Router()
const Controller = require('../controllers/usercontroller')
const Authenticate = require('../middleware/authenticate.js')

router.post("/register", Controller.register)
router.post("/login", Controller.login)
router.post("/google", Controller.gLogin)
router.post("/check", Authenticate, Controller.checkLogin)


module.exports = router;