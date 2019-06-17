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
  let now = new Date()
  if ( this.dueDate > now ){
    next()
  }else{
    throw({
      status: 400,
      msg: "You Cannot Set Due Date Before This Day"
    })
  }
})

let Todo = mongoose.model('Todo', todo)

module.exports = Todo