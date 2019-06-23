const router = require('express').Router()
const todo = require('../controllers/todo')
const auth = require('../middlewares/authenticate')
const autho = require('../middlewares/authorize')

router.use(auth)
router.get("/list", todo.list);
router.get("/email", todo.email);
router.get("/filter/:field/:value", todo.filter);
router.post("/create",todo.create);
router.patch("/complete/:id", autho, todo.complete);
router.delete("/delete/:id", autho, todo.delete)

module.exports = router
