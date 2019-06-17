const mongoose = require('mongoose')

let Schema = mongoose.Schema

let todo = new Schema({
  name: {
    type: String,
    maxlength: [15, 'Please Enter Title Max 15 Character'],
    required: [true, 'Todo Title Cannot Be Empty']
  },
  description: {
    type: String,
    required: [true, 'Todo Description Cannot Be Empty']
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
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }
}, {
  timestamps: true
})

todo.pre('save', function (next) {
  next()
})

let Todo = mongoose.model('Todo', todo)

module.exports = Todo