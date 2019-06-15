const Todo = require('../models/').Todo

class ControllerTodo {
	static findAll(req, res, next){
	    Todo.find()
		    .then(result => {
		      res.json(result)
		    })
		    .catch(next)
	}

	static create(req, res, next){
		let input = req.body
		// name: String,
		// description: String,
		// status: String, --not from inital user input
		// dueDate: Date
		Todo.create(input)
		.then(created => {
			res.json(created)
		})
		.catch(next)
	}
}

module.exports = ControllerTodo