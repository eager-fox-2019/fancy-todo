require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const routes = require('./Routes')
const mongoose = require('mongoose')
const cors = require('cors')

// change name of the database

mongoose.connect('mongodb://localhost/FancyTodo', {useNewUrlParser : true})

app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.json())
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log('mongoose connected!')
})

app.use('/', routes)

app.use((err, req, res, next) => {
    console.log(err.name)
    if(err.name === 'ValidationError'){
        res.status(400).json(err)
    }
    res.status(500).json({
        msg : 'internal server error'
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
