const routes = require("express").Router()
const TodoController = require("../Controllers/Todo.js")
const {Authentication, Authorization} = require('../Middlewares/Auth.js')


routes.use(Authentication)
routes.post("/", TodoController.create)
routes.get("/", TodoController.read)

routes.delete("/:id", Authorization, TodoController.delete)
routes.patch("/:id", Authorization, TodoController.edit)

module.exports = routes