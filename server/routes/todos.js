const router = require('express').Router();
const Controller = require('../controllers/todocontroller.js');
const Authenticate = require('../middleware/authenticate.js');
const Authorize = require('../middleware/authorize.js').todo;

router.use(Authenticate)
router.post("/", Controller.create)
router.get("/", Controller.findAll) // Add opitonal req param for done and not done
router.delete("/:id", Authorize, Controller.delete)
router.patch("/:id", Authorize, Controller.update)

module.exports = router;