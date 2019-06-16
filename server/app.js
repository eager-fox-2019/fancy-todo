if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
    require('dotenv').config();
}

const express = require('express')
const app = express()
const port = process.env.PORT
const route = require('./routes')
const mongoose = require('mongoose')
const errHandler = require('./middleware/errHandler')
const cors = require('cors')

mongoose.connect(process.env.URL, {useNewUrlParser: true},(err)=> {
    if (err) {
        console.log (`Error while connecting to database', detail: ${err}`);
    } else {
        console.log ('Connection established to database')
    }
})

app.use(cors())
app.use(express.urlencoded( {extended : false} ))
app.use(express.json())

app.use ('/',route)

app.use(errHandler)

app.listen(port, ()=> {
    console.log (`Connected on port: ${port}`)
})