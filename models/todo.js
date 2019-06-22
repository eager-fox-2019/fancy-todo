const mongoose = require('mongoose')

const {Schema} = mongoose
const todoSchema = new Schema({
    user : { type: Schema.Types.ObjectId, ref: 'User'},
    name : String,
    description: String,
    statusComplete: Boolean,
    dueDate:{
        type: Date,
        validate: [
            {
                validator: function (value) {
                    if (value <= new Date()){
                        return false
                    } else {
                        return true
                    }
                },
                message: 'Minimum due date for todo is tommorrow! Please make sure you input the right date!'            
            }
        ]
    },
})
const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo