const user = require('../models/userM')
const todo = require('../models/todoM')
const jwt = require('jsonwebtoken')

module.exports =  {
    authenticate : function(req,res,next){
        let token = req.headers.token
        if(!token) {
            throw ({code :401 , message :'Unauthorized'})
        }
        else {
            let decode = jwt.verify(token, process.env.JWT_SECRET)
            req.logedUser = decode
            next()
        }
    },
    authorization : function(req,res,next) {
        let decode = req.logedUser
        let todoId = req.params.taskId
        let authUser
        
        todo.findById({
            _id : todoId
        })
            .then(found => {
                console.log (found)
                authUser = found
                return user.findOne({
                    email : decode.email
                })
            })
            .then (founduser=> {
                if(founduser._id == authUser.userId) {
                    console.log ('berhasil authorized')
                    next()
                }
                else {
                    throw ``
                }
            })
            .catch(next)
    }
}