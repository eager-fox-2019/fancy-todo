const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    userId : {type : String, ref : 'User'},
    description : String,
    status : String,
    dueDate : String,
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo