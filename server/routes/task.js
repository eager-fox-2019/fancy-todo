const express = require('express')
const router = express.Router()

const ControllerTask = require('../controllers/ControllerTask')
const { authentication, authorization } = require('../middlewares/author_authen')

router.post('/', authentication, ControllerTask.create)
router.get('/', authentication, ControllerTask.read)
router.get('/:taskId', authentication, authorization,ControllerTask.readOne)
router.patch('/:taskId', authentication, authorization, ControllerTask.update)
router.delete('/:taskId', authentication, authorization, ControllerTask.delete)
router.put('/done/:taskId', authentication, authorization, ControllerTask.checkDone)
router.delete('/done/:taskId', authentication, authorization, ControllerTask.checkDone)

module.exports = router