const router = require("express").Router()
const todo = require('./todo')
const user = require("./user")

router.get("/", (req, res) => {
  res.json({ message: 'API connected' })
})

router.use("/todo", todo)
router.use("/user", user)

module.exports = router