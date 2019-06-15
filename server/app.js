if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const index = require('./routers/index.js')
const cors = require('cors')
const mongoose = require('mongoose')
const error = require('./helpers/error')
const url = process.env.DATABASE_URL

mongoose.connect(url, {
  useNewUrlParser: true
})
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(err => {
    console.log(err)
  })

app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', index)
app.use(error)

app.listen(port, () => {
  console.log('listening to port', port)
})
