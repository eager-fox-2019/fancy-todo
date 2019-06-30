const route = require('express').Router()
const todoController = require('../controller/todo')
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

route.use(authentication)
route.get('/',todoController.findAll)
route.get('/:id', todoController.findByPk)
route.post('/',todoController.create)
route.delete('/:id',authorization,todoController.delete)
route.put('/:id',authorization, todoController.update) 
// route.patch('/description/:id',todoController.updateDescription)
    
module.exports = route


