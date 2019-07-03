const router= require('express').Router()
const todoController= require('../contollers/todo')
const autheication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')

router.use(autheication)
router.get('/', todoController.getAll)
router.get('/details/:id', todoController.getOne)
router.get('/:status', todoController.getWithStatus)
router.get('/status/deadline', todoController.getDeadline)
router.post('/', todoController.create)
router.patch('/:id/:status', authorization,todoController.update)
router.patch('/:id', authorization,todoController.updateComplete)
router.delete('/:id', authorization, todoController.delete)


module.exports= router