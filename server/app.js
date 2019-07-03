// require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const index=require('./router/index')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')

app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(express.json())

const db = process.env.DB || 'mongodb://localhost:27017/fancy-todo'
mongoose.connect(, {useNewUrlParser: true})

app.use('/', index)
app.use(errorHandler)


app.listen(port, ()=>console.log('listening to port :3000'))

