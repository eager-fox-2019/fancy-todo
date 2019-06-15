const mongoose = require('mongoose')
let Schema = mongoose.Schema

let todoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "unfinished"
  },
  duedate: {
    type: Date
  }
})

let Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo