const mongoose = require('mongoose');
const {Schema} = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    todoId : [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project