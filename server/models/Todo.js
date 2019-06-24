const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
    name: String,
    status: Boolean
})
const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo