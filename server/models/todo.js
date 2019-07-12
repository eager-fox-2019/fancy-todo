const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    title:{
        type:String,
        required:[true,'the field is required']
    },
    description:{
        type:String,
        required:[true,'the field is required']
    },
    category:{
        type:String
    },
    dueDate:{
        type:Date,
        required:[true,'the field is required'],
        validate : {
            validator() {
                if (this.dueDate < this.createdAt) {
                    return false
                }
            },
            message: `cannot make todo from the past!`
        },
        timestamps: true
    },
    createdAt:{ type: Date, default: Date.now, timestamps: true},
    status:{
        type:String,
        default:'Unfinished'
    },
    userId:{
        type:Schema.Types.ObjectId, ref:'User'
    },
    projectId : {
        type : Schema.Types.ObjectId,
        ref : 'Project'
    }
})
const Todo = mongoose.model('Todo',todoSchema)
module.exports = Todo