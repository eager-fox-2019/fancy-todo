'use strict'
require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const routes = require('./routes/index.js')
const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
 
app.use('/api', routes);

app.use((err, req, res, next) => {
	switch (err.status){
		case (400):
			res.status(400).json({
				message: err.message || 'Invalid access token'
			})
			break;
		case (401):
			res.status(401).json ({
				message: err.message || 'Unauthorized access'
			})
			break;
		case (403):
			res.status(403).json({
				message: err.message || 'Forbidden access'
			})
			break;
		case (404):
			res.status(404).json ({
				message: err.message || 'Page not found'
			})
			break;
		case (500):
			res.status(500).json ({
				message: err.message || 'Internal server error'
			})
			break;
		default:
			if (err.name == 'SequelizeValidationError'){
				const errors = err.errors.map(error => ({
					message: error.message,
					path: error.path
				}))
				
				res.status(400).json({
					errors
				})
			} else {
				res.json(err)
			}
	}
})

app.listen(port, () => 
	console.log(`Server Starts on ${port}`))