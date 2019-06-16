require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');

// routes
const todoRoute = require('./routes/todos.js')
const userRoute = require('./routes/users.js')
const projectRoute = require('./routes/projects.js')

// mongodb connection
mongoose.connect('mongodb://localhost/lc-fancytodo', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// setting middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/users', userRoute)
app.use('/todos', todoRoute)
app.use('/projects', projectRoute)

// setting error handler
app.use((err, req, res, next) => {
  console.log('Error caught by error handler')
  console.log(err)
  let status = err.status || 500
  let message = err.msg || "Internal server error"
  res.status(status).json({ message });
});

const PORT = 3000
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) })