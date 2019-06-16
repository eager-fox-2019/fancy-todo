const router = require("express").Router()
const userRouter = require('./user');
const todoRouter = require('./todo');

router.use('/user', userRouter);
router.use('/todo', todoRouter);


module.exports = router