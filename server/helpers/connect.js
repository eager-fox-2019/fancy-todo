const mongoose = require('mongoose')
const dbName = "fancyTodo"
const url = 'mongodb://localhost:27017/' + dbName

function connect() {
	return new Promise ((resolve, reject) => {

		mongoose.connect(url, {useNewUrlParser:true, useFindAndModify: false }, err => {
			if (err) {
				reject({status:500})
			} else {
				resolve()
			}
		})

	})
}

module.exports = connect