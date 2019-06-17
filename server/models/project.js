const mongoose = require('mongoose')
const Schema = mongoose.Schema

let projectSchema = new Schema ({
  projectName: String,
  projectMaker: {type: Schema.Types.ObjectId, ref: 'user'},
  projectMembers: [{type: Schema.Types.ObjectId, ref: 'user'}]
})

let Project = mongoose.model('project', projectSchema)

module.exports = Project