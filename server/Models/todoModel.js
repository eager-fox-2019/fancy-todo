var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let todoSchema = new Schema({
    userId : { type : Schema.Types.ObjectId, ref : 'Users'},
    title : String,
    description : String,
    status : String,
    dueDate : Date
})

let Todo = mongoose.model('Todos', todoSchema)

module.exports = Todo