const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Todo = require('./Todo')
const projectSchema = new Schema({
    title: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    todos: [{
        type: Schema.Types.ObjectId,
        ref: "Todo"
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    progress: Number,
    deadline: Date
})

projectSchema.pre('save', async function (next) {
    let progress = 0
    this.todos.forEach(async todoId => {
        let todo = await Todo.findById(todoId)
        if (todo.status) {
            progress++
        }
    });
    this.progress = progress
    console.log(this);
    next()
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project