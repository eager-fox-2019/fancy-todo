const Todo = require('../models/todo')
const ObjectID = require('mongodb').ObjectID

module.exports = {
    authorization(req,res,next) {
        Todo.findOne({
            _id: req.params.id
        })
            .then(todo => {
                if(todo) {
                    const {id} = req.decode
        
                    let strObj = todo.user + ''

                    console.log(strObj, id)
                    if(strObj === id) {
                        console.log('masuk')
                        next()
                    }
                    else {
                        next({status: 401, message: "unauthorized"})
                    }
                }
                else {
                    next({code: 404})
                }
            })
            .catch(err => {
                next({status: 401, message: "unauthorized"})
            })
    }
}