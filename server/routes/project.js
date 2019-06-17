const router = require('express').Router()
const ProjectController = require('../controllers/project')
const TodoController = require('../controllers/todo')


router.get('/',ProjectController.getAll)
router.post('/',ProjectController.create)
router.get('/:id',ProjectController.getOne)
router.get('/:id/todos',TodoController.getAllInProject)

router.patch('/:id',ProjectController.update)
router.delete('/:id',ProjectController.delete)

module.exports = router