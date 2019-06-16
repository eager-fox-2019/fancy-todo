const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const db = mongoose.connection;
require('dotenv').config()
const port = process.env.PORT
const routes = require('./server/routes/index')


mongoose.connect('mongodb://localhost:27017/WhatTodo', {useNewUrlParser: true, useCreateIndex: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to the database')
});

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use('/', routes)

app.use((err, req, res, next) =>{
    console.log(err)
    if(err.message){
        res.status(400).json(err.message)
    }else{
        res.status(500).json('Internal Server Error')
    }
})  

app.listen(port, () => console.log(`Listening on port ${port}!`))