const mongoose = require('mongoose')
const Schema = mongoose.Schema

let todoSchema= new Schema({
    userId: String,
    name: {
        type: String,
        required: [true, 'Title task must be filled']
        },
    description: {
        type: String,
        required: [true, 'Description of task must be filled']
        },
    status:String,
    dueDate: {
        type: Date,
        required: [true, 'Due Date must be filled']
        },
    type:{
        type: String,
        required: [true, 'Type must be choosed']
    },
    endDate: Date
})

let Todo= mongoose.model('todo', todoSchema)

module.exports= Todo