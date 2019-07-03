if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
    require('dotenv').config()
}


const express = require("express")
const app = express()
const cors = require('cors')
const port = 3000
const route = require('./routes')
const mongoose = require('mongoose')
const errorHandler = require('./middleware/errorHandler')

mongoose.connect(`mongodb+srv://anameilani:ana1106131176@cluster0-ogdd6.gcp.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true}, function(err){
    if(err) throw err
    else console.log('success connect to database')
});

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use('/',route)
app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`listening to port: ${port}`);
})