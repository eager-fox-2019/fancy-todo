if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

const port = process.env.PORT || 3000
const url = process.env.DATABASE_URL || 'mongodb://localhost/fancy-todo'
const routes = require('./routes')
const error = require('./helpers/error')

mongoose.connect(url, { 
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
 })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => { 
    console.log(err)
  })

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use("/", routes)

app.use(error)

app.listen(port, () => {
  console.log('Listening on port',port)
})