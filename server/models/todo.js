const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  description: String,
  status: String,
}, { timestamps: true })

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo