const tagController = require('../controller/tagController')
const router = require('express').Router()
//https://localhost/tag/

router.get('/', tagController.findAll)
router.get('/:name', tagController.findOne)
router.post('/:todoId', tagController.create)
router.patch('/:tagId/:addOrRemove/:todoId',tagController.updateTodoIdsInTag)
router.delete('/:tagId', tagController.delete)


module.exports = router