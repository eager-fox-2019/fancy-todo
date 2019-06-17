const mongoose = require('mongoose')
const { momentjs } = require('../helpers/moment')

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
  },
  dayLeft : {
    type : String
  }
})

todoSchema.post('find',function(result){
  result.forEach(el => {
    el.dayLeft = momentjs(el.due_date)
  });
})

todoSchema.pre('save',function(next){
  if(momentjs(this.due_date) < 0) {
    throw({ code : 400, message : "date invalid" })
  }else {
    next()
  }
})

let Todo = mongoose.model('Todo', todoSchema)


module.exports = Todo
