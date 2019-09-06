const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: String,
    description: String,
    status: Boolean,
    due_date: Date,
    group: String,
    UserId: { type: Schema.Types.ObjectId, ref: 'User'}
});

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;