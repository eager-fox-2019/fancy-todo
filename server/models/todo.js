const mongoose = require('mongoose')

const {Schema} = mongoose
const todoSchema = new Schema({
    user : { type: Schema.Types.ObjectId, ref: 'User'},
    name : String,
    description: String,
    statusComplete: Boolean,
    dueDate: Date,
})
const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo