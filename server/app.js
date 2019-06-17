const express = require('express')
const app = express()
const routes = require('./routes')
const port = 3000
const cors = require('cors')
require('dotenv').config()

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors())
app.use('/', routes)

const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/fancytodo'
mongoose.connect(url, {useNewUrlParser: true}, (err) => {
    if(err) {
        console.log(err)
    }
    else {
        console.log('Connection success')
    }
});

app.use(function(err,req,res,next){  
    if (err.code === 404) {
          res.status(404).json({
            message: 'Resource not found',
          });
          
        } else if (err.name === 'SequelizeValidationError') {
          const errors = err.errors.map((error) => ({
            message: error.message,
            path: error.path,
          }));
      
          res.status(400).json({
            errors,
          });
          
        } else {
          const status = err.status || 500
          const message = err.message || 'Internal server error'
          res.status(status).json({
            message: message
          });
        }
      })


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})



