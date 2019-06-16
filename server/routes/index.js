const route = require('express').Router();
const todoRoute = require('./todo');
const userRoute = require('./user');

route.use('/api/todo', todoRoute);
route.use('/user', userRoute);

module.exports = route;