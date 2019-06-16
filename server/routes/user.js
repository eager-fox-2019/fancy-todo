const route = require('express').Router();
const userController = require('../controllers').user;
const oauthController = require('../controllers').oauth;

route.post('/register', userController.register);
route.post('/login', userController.login);
route.post('/oauth', oauthController.githubOauth);

module.exports = route;