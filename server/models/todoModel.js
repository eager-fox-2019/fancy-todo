const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const moment = require('moment')

const todoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Todo name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    status: String,
    owner: [{
        type: ObjectId,
        ref: 'User',
        required: [true, 'Owner is required'],
    }],
    due_date: {
        type: String,
        required: [true, 'Due Date is required'],
    },
    projectId: String,
    members: [],
},{ timestamps: true })

todoSchema.pre('save', function (next) {
    this.status = 'todo'
    let dateInput = moment(this.due_date)
    // let momentDate = moment(this.due_date).format("LL")
    let now = moment()
    let diff = dateInput.diff(now, "days")
    // console.log(diff)
    if(diff < 0)next({ status: 400, messages: `Date must be today or later!` })
    next()
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo