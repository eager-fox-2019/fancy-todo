const mongoose = require('mongoose')
let Schema = mongoose.Schema

let todoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  title: {
    type: String,
    required: [true, "Title cannot be blank !!!"]
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: "unfinished"
  },
  duedate: {
    type: Date
  }
}, {timestamps: true})

todoSchema.pre('save',function(next){
  if (this.duedate < new Date()) {
    next({ code: 400, message: "Due date cant be the past!!!" })
  }
  else
    next()
})

let Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo