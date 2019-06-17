const router = require('express').Router();
const todo = require('./todoRoutes')
const user = require('./userRoutes')

router.use('/', user)
router.use('/todos', todo)

module.exports = router