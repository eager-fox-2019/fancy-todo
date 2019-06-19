const Todo= require('../models/todo')

function authorization(req, res, next){
    console.log('masuk authorize')
    Todo.findById(req.params.id)
    .then(todo=>{
        if(!todo){
            res.status(404).json('Not found')
        }else{
            if(req.decode.id == todo.userId){
                next()
            }else{
                res.status(403).json('Not Authorized')
            }
        }
    })
    .catch(next)
}

module.exports= authorization