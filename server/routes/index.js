const router = require("express").Router()
const todo = require('./todo')
const project = require('./project')
const user = require("./user")

router.get("/", (req, res) => {
  res.json({ message: 'API connected' })
})

router.use("/todo", todo)
router.use("/project", project)
router.use("/user", user)

module.exports = router