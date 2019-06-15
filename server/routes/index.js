const router = require('express').Router()
const connect = require('../helpers/connect.js')
const userRoutes = require('./users')
const todoRoutes = require('./todos')

//connect to mongoose
router.use((req,res,next) => {
	connect()
		.then(() => next())
		.catch(next)
})

router.use('/users', userRoutes)
router.use('/todos', todoRoutes)

module.exports = router