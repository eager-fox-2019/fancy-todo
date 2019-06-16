const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todosSchema = new Schema({
  name: String,
  description: String,
  status: {type: Boolean, default: false},
  due_date: Date,
  email: {
    type: String
  }
})


const Todo = mongoose.model('Todo', todosSchema)

module.exports = Todo