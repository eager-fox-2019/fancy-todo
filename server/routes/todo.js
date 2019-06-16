const router = require("express").Router()
const TodoController = require("../controllers/todo-controller")
const authenticate = require("../middlewares/authenticate")

router.post("/create", authenticate, TodoController.Create)
router.get("/bored", authenticate, TodoController.Bored)
router.get("/all", authenticate, TodoController.findAll)
router.put("/update", authenticate, TodoController.update)
router.delete("/delete", authenticate, TodoController.delete)

module.exports = router