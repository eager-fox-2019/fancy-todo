const mongoose = require('mongoose')

let memberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    projectId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
})


let Member = mongoose.model('Member', memberSchema)

module.exports = Member