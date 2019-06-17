const mongoose = require('mongoose')
const Schema = mongoose.Schema

let todoSchema = new Schema({
  title: String,
  description: String,
  dueDate: String,
  userId: String,
  projectId: String,
  status: String
})

let Todo = mongoose.model('todo', todoSchema)

module.exports = Todo