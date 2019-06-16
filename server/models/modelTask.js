'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  title: String,
  note: String,
  due_date: Date,
  completed_date: Date,
  is_done: Boolean,
  is_starred: Boolean,
  is_late: Boolean,
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});



var Task = mongoose.model('Task', taskSchema);

module.exports = Task