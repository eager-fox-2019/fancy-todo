const userController = require('../controllers/userController')
const router = require('express').Router()
const {
    Authenticate
} = require('../middleware/authentication')

router.use('/', Authenticate)
router.get('/', userController.getAll)

module.exports = router