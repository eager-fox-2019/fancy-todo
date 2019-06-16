const router = require('express').Router()
const userController = require('../controller/userController')
//path https://localhost/user

router.get('/', userController.findLoggedUser) // get info on logged in user
router.get('/:userId', userController.findOtherUser) // get other users
router.delete('/', userController.deleteUser) // delete logged in user
router.patch('/info', userController.updateInfoUser) // update info, including add TagIds, TodoIds and groupingIds
// router.patch('/:field', userController.update)


module.exports = router