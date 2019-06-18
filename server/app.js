require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3100
const CONNECTION_URI = process.env.MONGGODB_URI || `${process.env.MONGGODB_URL}/${process.env.MONGGODB_NAME}`
const routes = require('./routes/')
const mongoose = require('mongoose');
const checkDateline = require('./helpers/checkDueDate')
const schedule = require('node-schedule');
mongoose.connect(CONNECTION_URI, {useNewUrlParser: true})
.then(() =>{
      console.log('MongoDB connected')
})
.catch(err =>{
      console.log(err)
})
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors())
app.use('/api', routes)
app.use((err,req,res,next) => {
    if(err.code === 404){
        res.status(404).json({
            message : "Not Found"
        })
    } else if(err.name === 'ValidationError'){
        var errorArr = []
        for (let listErr in err.errors) {
            errorArr.push({
                message : err.errors[listErr].message,
                path : err.errors[listErr].path
            })
        }
        res.status(400).json({
            errorArr
        })
    } else if(err.code === 500) {
        res.status(500).json({
            message : 'Internal Server Error'
        })
    } else {
        res.status(err.code).json({
            message : err.message
        })
    }
})

var event = schedule.scheduleJob("*/1 * * * *", function() {
    checkDateline()
});

app.listen(port, () => {
    console.log('this app running on port ' + port)
})
