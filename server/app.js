require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./routes')

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
.then(resp => {
    console.log("We're Connected")
})
.catch(err => {
    console.log("We failed to connect")
})

app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.use(cors())

app.use('/', router)

app.use(function(err,req,res,next){
    console.log(err);
    
    res.status(500).json({
        message: "Internal Server Error"
    })
})

app.listen(port,()=>{
    console.log('listening in port 3000');
    
})