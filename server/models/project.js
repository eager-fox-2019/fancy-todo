const mongoose = require('mongoose')

let Schema = mongoose.Schema

let project = new Schema({
  name: {
    type: String,
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
  member: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

let Project = mongoose.model('Project', project)

module.exports = Project