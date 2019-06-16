const mongoose = require('mongoose')

let Schema = mongoose.Schema

let todo = new Schema({
  name: {
    type: String,
    required: [true,'Todo Title Cannot Be Empty']
  },
  description: {
    type: String,
    required: [true,'Todo Description Cannot Be Empty']
  },
  dueDate: {
    type: Date,
    default: new Date()
  },
  status: {
    type: String,
    default: 'Open'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
})

let Todo = mongoose.model('Todo', todo)

module.exports = Todo