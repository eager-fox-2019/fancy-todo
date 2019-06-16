var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let todoSchema = new Schema({
    userId : String,
    title : String,
    description : String,
    status : String,
    dueDate : Date
})

let Todo = mongoose.model('Todos', todoSchema)

module.exports = Todo