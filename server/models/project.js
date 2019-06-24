const mongoose = require('mongoose')
let Schema = mongoose.Schema

let projectSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  todo: [{
    type: Schema.Types.ObjectId,
    ref: 'Todo'
  }],
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

let Project = mongoose.model('Project', projectSchema)

module.exports = Project