require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes')
const cors = require('cors')
const errHandler = require('./helpers/errorHandler')
const app = express()
const port = 3000

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
.then(resp => {
    console.log('===== MONGODB CONNECTED =====')
})
.catch(err => {
    console.log('===== MONGODB CONNECTED FAILED =====')
})

app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.use(cors())

app.use('/', router)
app.use(errHandler)

app.listen(port, function(){
    console.log('Running on port', port);
})