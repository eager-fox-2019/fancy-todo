const router = require('express').Router();
const todoController = require('../controllers/todoController')
const authentication  = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

router.use(authentication)
router.get('/', todoController.readAll)
router.post('/', todoController.create)

router.get('/:id', todoController.findByPk)
router.delete('/:id', authorization, todoController.deleteById)
router.put('/:id', authorization, todoController.putUpdate)
router.patch('/:id', authorization, todoController.patchUpdate)

module.exports = router