const router = require("express").Router()
const UserController = require("../controllers/user-controller")

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.post("/googlesignin", UserController.googlesignin)

module.exports = router