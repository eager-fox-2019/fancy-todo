const mongoose = require('mongoose')

let Schema = mongoose.Schema

let project = new Schema({
  name: {
    type: String,
    maxlength: [15, 'Please Enter Title Max 15 Character'],
    required: [true,'Todo Title Cannot Be Empty']
  },
  description: {
    type: String,
    required: [true,'Todo Description Cannot Be Empty']
  },
  owner:{
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  pending: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  todos: [{
    type: Schema.Types.ObjectId,
    ref: 'Todo'
  }]
}, {
  timestamps:true
})

project.pre('save', function(next){
  this.members.push(this.owner)
  next()
})

let Project = mongoose.model('Project', project)

module.exports = Project