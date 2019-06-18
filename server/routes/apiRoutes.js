const express = require('express');
const routes = express.Router();
const ApiController = require('../controllers/ApiController')

routes.get('/bored', ApiController.generateRandomActivity)
routes.post('/currentweather', ApiController.getCurrentWeather)

module.exports = routes

