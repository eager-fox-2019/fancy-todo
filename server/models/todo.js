const mongoose = require('mongoose');
const Schema = mongoose.Schema


const todoSchema = new Schema({
    userId: {
        type: String,
        required: [true, "User cannot be empty"]
    },
    task: {
        type: String,
        required: [true, "Task cannot be empty"]
    },
    time: {
        type: Date,
        required: [true, "Date required"]
    },
    type: {
        type: String
    },
    status: {
        type: Boolean
    }

})

module.exports = mongoose.model("Todo", todoSchema)