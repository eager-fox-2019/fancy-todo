const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
	name: {
		type: String,
		default: "no name"
	},
	description: {
		type: String,
		default: "no description"
	},
	status: {
		type: String,
		default: "not done"
	},
	dueDate: {
		type: Date,
		default: new Date()
	},
	owner: {
		type: String,
		default: "no owner"
	}
});

const Todo = mongoose.model('Todo',todoSchema)

module.exports = Todo