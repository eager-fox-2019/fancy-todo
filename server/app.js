require('dotenv').config()
const port = 3000
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const errorHandler = require('./helpers/errorHandler')

mongoose.connect(process.env.DB_PATH, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connection successful');
    }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/', require('./routes'))

app.use(errorHandler)
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})