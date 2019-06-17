const routes = require("express").Router()
const User = require("./User.js")
const Todo = require("./Todo.js")

routes.get('/',function(req,res) {
    res.sendFile('index.html')
  })
routes.use("/", User)
routes.use("/todo", Todo)

module.exports = routes