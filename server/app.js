if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const { errorHandler } = require('./middlewares/errorHandlers')
const routeIndex = require('./routes')
const Port = 3000

// connect mongodb
mongoose.connect('mongodb://localhost:27017/task_db', { useNewUrlParser: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected");  
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/', routeIndex)
app.use(errorHandler)

app.listen(Port, () => {
  console.log(`Listening to port ${Port}`);
})

