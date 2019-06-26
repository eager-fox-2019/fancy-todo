const mongoose = require('mongoose')

let todoSchema = new mongoose.Schema({
    userId : String,
    name : String,
    description : String,
    status : String,
    dueDate : Date
})

let todo = mongoose.model('Todo',todoSchema)

module.exports = todo