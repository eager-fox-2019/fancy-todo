let todo = require('../models/todoModel')
let ObjectId = require('mongoose').Types.ObjectId

module.exports=function(req,res,next){
    let id = req.params.todoId
    console.log(req.decoded.id)
    todo
        .findById(id)
        .then(response=>{
            if(response.UserId.equals(req.decoded._id)){
                console.log('authorization')
                next()
            }
            else{
                res.status(401).json({msg:'not authorized'})
            }
        })
        .catch(err =>{
            res.status(500).json(err)
        })
}
