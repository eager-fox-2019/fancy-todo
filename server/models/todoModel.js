const mongoose = require('mongoose')
//port = 27017
//dbName = fancy-todo
mongoose.connect('mongodb://localhost:27017/fancy-todo', {useNewUrlParser: true})
const {Schema} = mongoose

const todoSchema = new Schema({
    title: String,
    due_date: Date,
    reminder: Date,
    status: Boolean,
    UserId: { type: Schema.Types.ObjectId, ref: 'User'},
    ProjectId: {type: Schema.Types.ObjectId, ref: 'Grouping'},
    tag: []
})

const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo 