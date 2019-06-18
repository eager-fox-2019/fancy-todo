const express = require('express');
const routes = express.Router();
const ProjectController = require('../controllers/ProjectController')

routes.get('/', ProjectController.list)
routes.get('/members', ProjectController.members)
routes.post('/', ProjectController.create)
routes.patch('/:id/addMember', ProjectController.addMember)
routes.patch('/:id/removeMember', ProjectController.removeMember)
routes.patch('/:id', ProjectController.setName)
routes.delete('/:id', ProjectController.delete)

module.exports = routes