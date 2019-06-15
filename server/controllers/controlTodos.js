const Todo = require('../models/').Todo
const User = require('../models/').User

class ControllerTodo {
	static findAll(req, res, next){
	    let userEmail = req.decode
	    User.findOne({email: userEmail})
	    .then(user => {
	    	if (user){
				return Todo.find({owner: user._id})
	    	} else {
	    		throw new Error("user not found")
	    	}
	    })
		.then(todoList => {
			res.json(todoList)
		})
		.catch(next)
	}

	static update(req, res, next){
		let userId = req.params.userId
		Todo.findOneAndUpdate({_id:req.params.id, owner:userId}, req.body, {new: true})
		.then(updated => {
			res.json(updated)
		})
		.catch(next)
	}

	static delete(req, res, next){
		let userId = req.params.userId
		Todo.findOneAndDelete({_id:req.params.id, owner:userId})
		.then(deleted => {
			res.json(deleted)
		})
		.catch(next)
	}

	static create(req, res, next){
	    let userEmail = req.decode
	    let todoInput = req.body //should have name and description
	    // res.json(req.decode)
	    if (userEmail){
	      User.findOne({email: userEmail})
	      .then(found => {
	        if (found){
	          // res.json(found)
	          todoInput.owner = found._id
	          return Todo.create(todoInput)
	        } else {
	          throw new Error("user not found")
	        }
	      })
	      .then(createdTodo => {
	        res.json(createdTodo)
	      })
	      .catch(next)
	    } else {
	      res.status(404).json("user not found")
	    }
	}
}

module.exports = ControllerTodo