const mongoose = require('mongoose')
const moment = require('moment')

let todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, `Title required.`],
  },
  description : {
      type : String,
  },
  due_date : {
      type : String,
  },
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  projectId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Project'
  }
})

todoSchema.pre('save', function (next) {
  let due_date = moment(this.due_date);
  let in_date = moment(new Date())
  this.due_date = Math.ceil(moment.duration(due_date.diff(in_date)).asDays())
  next()
})

let Todo = mongoose.model('Todo', todoSchema)


module.exports = Todo
