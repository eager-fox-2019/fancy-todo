require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const PORT = process.env.PORT
const routes = require('./routes')
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true)

app.use(cors())

mongoose.connect('mongodb://localhost/fancy_todo', {useNewUrlParser: true});

app.use(express.json() )
app.use(express.urlencoded({extended:true}))
app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})