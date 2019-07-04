if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = process.env.PORT || 3000 // if use dotenv: process.env.PORT
const routes = require('./routes')
const cors = require('cors')
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/fancy-todo'
const errorHandler = require('./helpers/error-handler')

mongoose.connect(url, {useNewUrlParser: true}, function(err){
    if(err) console.log('Connection database failed');
    else console.log('Connection database success');
})

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())

app.use('/', routes)
app.use(errorHandler)

app.listen(port, function(){ 
    console.log("Listening to port ", port)
})