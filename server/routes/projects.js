const router = require('express').Router();
const Controller = require('../controllers/projectcontroller.js');
const Authenticate = require('../middleware/authenticate.js');
const Authorize = require('../middleware/authorize.js').project;

router.use(Authenticate)
router.post("/", Controller.create) // create project
router.get("/", Controller.findAll) // find all projects that the current user is a member of
router.get("/:id", Authorize, Controller.findOne) // find one project by id
router.post("/:id", Authorize, Controller.newTodo) // create new todo in project
router.delete("/:id/:todoid", Authorize, Controller.deleteTodo) // delete todo in project
router.patch("/:id/:todoid", Authorize, Controller.updateTodo) // update todo in project, including changing status to done
router.delete("/:id", Authorize, Controller.delete) // delete entire project by id, including all of its todos
router.post("/:id/addmember", Authorize, Controller.addMember) // add member
router.post("/:id/removemember", Authorize, Controller.removeMember) // remove member

module.exports = router;