//Variable Declaration
require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const router = require('./routes');
const errHandler = require('./helpers/errHandler')
const port = process.env.PORT || 3000;


//Initial middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Connect To MongoDB via Mongoose
mongoose.connect('mongodb://localhost:27017/FancyTodo', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Cors,router, err Handling
app.use(cors()) //allow cors *
app.use('/', router) //Express router
app.use(errHandler) //Error Handling

//Start the app server
app.listen(port, console.log(`Fancy Todo started on port: ${port}`))