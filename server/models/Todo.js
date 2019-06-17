let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let todoSchema = new Schema({
    name: {
        type: String,
        required : true,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        required : true,
    },
    dueDate: {
        type: Date,
        required : true,
    },
    importantStatus : {
        type: Boolean,
    },
    UserId: {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
},{timestamps:true});

let Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo