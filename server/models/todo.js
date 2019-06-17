const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TodoSchema = new Schema(
  {
    name: String,
    userId: {type: 'ObjectId', ref: 'User'},
    description: String,
    status: {type : String, default : false},
    dueDate: Date
  })


const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo

