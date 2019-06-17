const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  task: {
    type: String,
    required: [true, 'Task is required']
  },
  description: String,
  status: Boolean,
  dueDate: {
    type: String,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  image: String
})

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo