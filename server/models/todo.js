const mongoose = require('mongoose');

let todoSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
  dueDate: Date,
  userEmail: String
});

let todoModel = mongoose.model('Todo', todoSchema);

module.exports = todoModel;