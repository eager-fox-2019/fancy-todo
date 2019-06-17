const mongoose = require('mongoose')

let projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, `Title required.`]
  },
  userId: {
    type : String,
    required: [true, `UserId required.`]
  },
  members : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],
  todos : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Todo'
  }]
})

let Project = mongoose.model('Project', projectSchema)

module.exports = Project
