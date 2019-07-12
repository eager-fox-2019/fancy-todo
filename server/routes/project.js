const router = require('express').Router()
const ProjectController = require('../controllers/project')
const {authenticate} = require('../middlewares/authenticate')
const authorization = require('../middlewares/authorization')
const isProjectMember = require('../middlewares/isProjectMember')

router.use(authenticate)
router.get('/pending', ProjectController.showPendingMember)
router.get('/:id', ProjectController.showOne)
router.get('/', ProjectController.showAll)
router.delete('/:id', ProjectController.delete)
router.put('/:id', ProjectController.update)
router.put('/addTodo/:id', isProjectMember, ProjectController.addProjectsTodo)
router.put('/invite/:id', ProjectController.inviteMember)
router.put('/join/:id', ProjectController.joinProject)
router.put('/decline/:id', ProjectController.declineProject)
router.post('/', ProjectController.create)

module.exports = router