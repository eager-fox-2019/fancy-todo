if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const route = require('./routes')
const cors = require('cors')
const errorMiddleware = require('./middlewares/error.middleware')
const mongoMiddleware = require('./middlewares/mongo.middleware')
const port = process.env.PORT || 3000

/**
 * pre route middleware
 */
app.use(cors())
app.use(mongoMiddleware)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

/**
 * route
 */
app.use('/', route)

/**
 * post route middleware
 */
app.use(errorMiddleware)

app.listen(port, () => console.log('jalan di', port))