const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
    name: String,
    description: String,
    status: Boolean,
    due_date: Date,
    assign: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true})

const Todo = mongoose.model('Todo', TodoSchema)
module.exports = Todo 