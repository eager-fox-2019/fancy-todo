const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectTodoSchema = new Schema({
  title: String,
  description: String,
  dueDate: Date,
  status: {
    type: Boolean, 
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
});

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  todos: [projectTodoSchema],
});

module.exports = mongoose.model('Project', projectSchema);