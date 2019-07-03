const router = require('express').Router()
const groupingController = require('../controller/groupingController')
//path https://localhost/grouping

router.get('/', groupingController.findAll)
router.get('/:groupingId', groupingController.findOne)
router.delete('/:groupingId', groupingController.delete)
router.patch('/contributor/add/:groupingId/:userId', groupingController.addContributor)
router.patch('/contributor/remove/:groupingId/:userId', groupingController.removeContributor)
router.patch('/:groupingId', groupingController.update)
// router.patch('/:groupingId/:addOrRemove/:todoId', groupingController.updateTodoIdinGrouping)
router.post('/', groupingController.create)

module.exports = router