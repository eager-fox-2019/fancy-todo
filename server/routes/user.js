const router = require("express").Router()
const user = require('../controllers/user')
const authenticate = require('../middlewares/authenticate')

router.post('/register', user.register)
router.post('/login',user.login)
router.post('/signinGoogle', user.GoogleSignIn)

router.use(authenticate)

router.get('/',user.read)
// router.update('/update/:id', user.update)
// router.delete('/delete/:id', user.delete)

module.exports = router