const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const projectSchema = new Schema({
    name: {
        type:String,
        required: [true, 'Project Name is Required']
    },
    owner: {
        type: ObjectId,
        ref: 'User'
    },
    member: [{
        type: ObjectId,
        ref: 'User'
    }]
},{ timestamps: true })

const Project = mongoose.model('Project', projectSchema)

module.exports = Project