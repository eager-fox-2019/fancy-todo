const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Required']
    },
    description: String,
    status: Boolean,
    due_date: Date,
    assign: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true})

TodoSchema.pre('save', function(next){
    this.status = 0
    next()
})

const Todo = mongoose.model('Todo', TodoSchema)
module.exports = Todo 