const mongoose = require('mongoose')
const Schema = mongoose.Schema
const hashPassword = require('../helpers/bcrypt.js').hashPassword

const userSchema = new Schema({
	username: String,
	email: {
		type: String,
		validate:
			{
				validator: function(u) {
					return User.findOne({username:u}).exec()
						.then(found => {
							if (found) {
								return false;
							}
						})
				},
				message: "username already registered"
			}
	},
	password: {
		type: String
	}
});

userSchema.pre('save', function(next){
	this.password = hashPassword(this.password)
	next()
})

// userSchema.pre('updateOne', function(next) {
// 	let updateValue = this._update //get update value
// 	if (updateValue.password){ //if password is updated, hash it before saving
// 		updateValue.password = hashPassword(updateValue.password)
// 	}
// 	next()
// })

const User = mongoose.model('User',userSchema)

module.exports = User