
const { db_url } = require('../config/mongo.config')
const mongoose = require('mongoose')

function connect(req, res, next) {
    mongoose.connect(db_url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        dbName: process.env.DB_NAME
    }, function (error) {
        if (error) {
            console.log(error)
            next(error)
        } else {
            console.log('database connected')
            next()
        }
    })
}

module.exports = connect