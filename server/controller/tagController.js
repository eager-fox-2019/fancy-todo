const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const tag = require('../models/tagModel')

class tagController{
    static findAll(req,res){
        let id = ObjectId(req.decoded._id)
        tag
            .find({UserId:id})
            .then(tags=>{
                res.status(200).json({data:tags})
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }
    static findOne(req,res){
        let name = req.params.name
        tag
            .findOne({name:name})
            .then(tag=>{
                res.status(200).json({data:tag})
            })
            .catch(err=>{
                res.status(404).json({error:err})
            })
    }
    static create(req,res){
        let todoId = req.params.todoId
        let id = ObjectId(req.decoded._id)
        let objInput = {
            name: req.body.name,
            TodoIds: todoId,
            UserId: id
        }
        tag
            .create(objInput)
            .then(createdTag => {
                res.status(200).json({data:tag})
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }

    static updateTodoIdsInTag(req,res){
        let tagId = ObjectId(req.params.tagId)
        let addOrRemove = req.params.addOrRemove
        let todoId = req.params.todoId
        if(addOrRemove === 'add'){
            tag
                .findByIdAndUpdate(tagId,
                    {$push:
                        {TodoIds: todoId}
                    },
                    {new:true}
                )
                .then( updated => {
                    res.status(200).json( { data: updated } )
                })
        }else if(addOrRemove === 'remove'){
            tag
                .findByIdAndUpdate(tagId,
                    {$pull:
                        {TodoIds: todoId}
                    },
                    {new:true}
                )
                .then( updated => {
                    res.status(200).json( { data: updated } )
                })
        }
    }

    static delete(req,res){
        let tagId = req.params.tagId
        tag
            .findByIdAndDelete(tagId)
            .then(deletedTag =>{
                res.status(200).json(deletedTag)
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }
}
module.exports = tagController
