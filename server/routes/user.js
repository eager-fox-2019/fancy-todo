const router = require("express").Router()
const user = require('../controllers/user')

router.post('/register', user.register)
router.post('/login',user.login)
router.post('/signinGoogle', user.GoogleSignIn)
// router.post('/logout',user.logout)
// router.update('/update/:id', user.update)
// router.delete('/delete/:id', user.delete)

module.exports = router