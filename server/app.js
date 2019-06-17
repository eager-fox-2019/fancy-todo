if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const express = require('express')
const cors = require('cors')
const route = require('./routes')
const mongoose = require('mongoose')
const app = express()

const port = process.env.PORT

let database = process.env.ATLASS_PASS ? `mongodb+srv://root:${process.env.ATLASS_PASS}@cluster0-qtp0t.gcp.mongodb.net/fancytodo?retryWrites=true` : 'mongodb://localhost:27017/fancytodo'
mongoose.connect(database,{ useNewUrlParser : true },function(err){
   if(err) console.log('connection error')
   else console.log('mongoose is connected')
})
mongoose.set('useFindAndModify', false);

app.use(cors())
app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use(route)

app.use( function(err,req,res,next) {
   if (err.name == 'ValidationError'){
       if(err.errors.email) {
           if(err.errors.email.reason){
               res.status(404).json(err.errors.email.reason)
           }else {
                res.status(404).json(err.message)
           }
        }else {
            res.status(404).json(err.message)
        }
    }
    else if(!err.code) {
        res.status(500).json({ message : 'Internal server error' })
    }
    else {
        if(err.name === 'MongoError'){
            res.status(500).json({ message : err.errmsg })
        }
        else {
            res.status(err.code).json({ message : err.message })
        }
   }
})
 
app.listen(port,() => {
  console.log(`listening on port: ${port}!`)
})
