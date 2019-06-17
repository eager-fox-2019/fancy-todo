const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  title: String,
  description: String,
  dueDate: Date,
  // status is 0 for 'in progress', 1 for 'complete'
  status: {
    type: Boolean, 
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Todo', todoSchema);