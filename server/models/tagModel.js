const mongoose = require('mongoose')
//port = 27017
//dbName = fancy-todo
mongoose.connect('mongodb://localhost:27017/fancy-todo', {useNewUrlParser: true})
const {Schema} = mongoose

const tagSchema = new Schema({
    name:String,
    TodoIds : [{ type: Schema.Types.ObjectId, ref: 'Todo'}],
    UserId: { type: Schema.Types.ObjectId, ref: 'User'} 
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag