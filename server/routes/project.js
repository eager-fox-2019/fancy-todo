const router = require("express").Router()
const project = require('../controllers/project')
const { authProject } = require('../middlewares/authorize')
const authenticate = require('../middlewares/authenticate')

router.use(authenticate)

router.post('/', project.create)
router.get('/', project.read)
router.get('/:id', authProject, project.readOne)
router.put('/:id', authProject, project.update)
router.patch('/:id', authProject, project.update)
router.delete('/:id', authProject, project.delete)

module.exports = router