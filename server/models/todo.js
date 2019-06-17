const mongoose = require('mongoose')

let Schema = mongoose.Schema
const todoSchema = new Schema({
    name: String,
    description: String,
    status: {
        type: Boolean,
        default: false
    },
    due_date: Date,
    user_id: String
},{timestamps : true})


const Todo = mongoose.model('Todo',todoSchema)

module.exports = Todo