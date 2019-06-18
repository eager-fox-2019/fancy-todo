const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    status: {
        type: Boolean
    },
    due_date: {
        type: Date,
        required: [true, 'Due date is required']
    },
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    projectId: {type: Schema.Types.ObjectId, ref: 'Project'}
}, { timestamps: true } );

todoSchema.pre('save',function(next, done) {
    this.status = false
    next()
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo