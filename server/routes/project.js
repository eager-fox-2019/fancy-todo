const express = require('express')
const router = express.Router()
const project = require('../controllers/project')
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorizationProject')

router.use(authentication)
router.get('/', project.findAll)
router.get('/:id', project.findOne)
router.post('/', project.create)
router.patch('/:id', authorization, project.patch)
router.delete('/:id', authorization, project.delete)

module.exports = router