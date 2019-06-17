require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const routes = require('./routes')

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true }, (err) => {
    if(err) console.log('database failed to connect..')
    else{
        console.log('database connection established')
    }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/',routes)

app.use((err,req,res,next) => {
    console.log('ini response error', err)
    const status = err.status || 500
    const message = err.message || 'Internal Server Error'
    res.status(status).json({message})
})

app.listen(port,() => {
    console.log(`listen to port:${port}`)
})