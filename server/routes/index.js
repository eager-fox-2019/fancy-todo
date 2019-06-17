const route = require('express').Router()
const { ControllerUser } = require('../controllers')
const { ControllerProject } = require('../controllers')
const { ControllerTodo } = require('../controllers')
const { authenticate } = require('../middlewares/auth')
const { authorizeTodo } = require('../middlewares/auth')
const { authorizeProject } = require('../middlewares/auth')
const { inviteMember } = require('../middlewares/auth')
const { memberAuthenticate } = require('../middlewares/auth')

route.get('/', (req, res) => {res.status(200).json({ message: 'Connect' })})
route.get('/authenticate',authenticate,(req,res)=>{ res.status(200).json({}) })

route.get('/user', authenticate, ControllerUser.findAll)
route.post('/register', ControllerUser.create)
route.post('/login', ControllerUser.login)
route.post('/google/login', ControllerUser.googleLogin)


route.post('/projects', authenticate,ControllerProject.create)
route.get('/projects', authenticate, ControllerProject.findAll)
route.get('/projects/:id', authenticate, ControllerProject.findOne)
route.delete('/projects/:id', authenticate, authorizeProject, ControllerProject.delete)
route.put('/projects/member/accept/:id',ControllerProject.addMember)
route.post('/projects/todos/:projectId', authenticate, memberAuthenticate, ControllerProject.addTodo)
route.put('/projects/todos/:projectId/:id',authenticate,memberAuthenticate,ControllerTodo.update)
route.delete('/projects/todos/:projectId/:todoId', authenticate, memberAuthenticate, ControllerProject.deleteTodo)
route.post('/member/:id', authenticate, inviteMember) 

route.post('/todos', authenticate, ControllerTodo.create)
route.get('/todos', authenticate, ControllerTodo.findAll)
route.get('/todos/:id', authenticate, ControllerTodo.findOne)
route.put('/todos/:id', authenticate, authorizeTodo, ControllerTodo.update)
route.delete('/todos/:id', authenticate, authorizeTodo, ControllerTodo.delete)

route.use('/*', (req, res) => res.status(404).json({error: 'Not Found :('}))

module.exports = route