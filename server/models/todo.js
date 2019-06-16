const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  task: String,
  description: String,
  status: Boolean,
  dueDate: String,
  time: String,
  image: String
})

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo