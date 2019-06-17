const express = require('express');
const route = express.Router();
const todoRoutes = require('./todoRoutes')
const userRoutes = require('./userRoutes')
route.use('/todo', todoRoutes)
route.use('/user',userRoutes)


module.exports = route