if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
    require('dotenv').config();
}

const express = require('express')
const cors = require('cors')
const route = require('./routes')
const mongoose = require('mongoose')
const errHandler = require('./middleware/errHandler')
const app = express()

const port = process.env.PORT
const database = 'mongodb+srv://yudawardana:sukamakan94~@yudawardana-i1zsd.gcp.mongodb.net/Fancy-todo?retryWrites=true&w=majority'

mongoose.connect(database, {useNewUrlParser: true},(err)=> {
    if (err) console.log (err) ,console.log ('Coonection error :(');
    else console.log ('Success Connected :)')
})

app.use(cors())
app.use(express.urlencoded({extended : false}))
app.use(express.json())

app.use ('/',route)

app.use(errHandler)

app.listen(port, ()=> {
    console.log (`Connected on post : ${port}`)
})