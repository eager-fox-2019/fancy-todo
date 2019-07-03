const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const grouping = require('../models/groupingModel')
const user = require('../models/userModel')

class groupingController{
    static findAll(req,res){   
        let id = ObjectId(req.decoded._id)
        console.log(id)
        grouping
            .find({UserIds:id})
            .then(groupings =>{
                console.log(groupings)
                res.status(200).json( groupings  )
            })
            .catch( err => {
                res.status(404).json( { error: err } )
            })
    }
    static findOne(req,res){
        let groupingId = ObjectId( req.params.groupingId )
        grouping
            .findById ( groupingId )
            .populate('Todo')
            .populate('UserIds')
            .then( grouping =>{
                if(grouping){
                    res.status(200).json( grouping )
                }else{
                    res.status(404).json({message:'not found'})
                }
            })
            .catch( err => {
                res.status(500).json( { error: err } )
            })
    }
    static delete(req,res){
        let groupingId = ObjectId(req.params.groupingId)
        grouping
            .findByIdAndDelete(groupingId)
            .then( deleted=>{
                if(deleted){
                    res.status(200).json({data:deleted})
                }else{
                    res.status(404).json({message:'not found'})
                }
            })
            .catch( err => {
                res.status(404).json( {error: err} )
            })
    }
    static update(req,res){
        let groupingId = ObjectId(req.params.groupingId)
        let input = req.body
        console.log(input)
        grouping
            .findById(groupingId)
            .then(user =>{
                user.set(input)
                return user.save()
            })
            .then(updated =>{
                res.status(200).json({data: updated})
            })
            .catch( error => {
                console.log(error)
                res.status(404).json({error: error})
            })
    }
    // static updateTodoIdinGrouping(req,res){
    //     let groupingId = ObjectId(req.params.groupingId)
    //     let todoId = ObjectId(req.params.todoId)
    //     let addOrRemove = req.params.addOrRemove
    //     if(addOrRemove === 'add'){
    //         grouping
    //             .findByIdAndUpdate(groupingId,
    //                 {$push:
    //                     {TodoIds: todoId}
    //                 },
    //                 {new:true},
    //             )
    //             .then( updatedGrouping =>{
    //                 res.status(200).json({data: updatedGrouping})
    //             })
    //             .catch( err => {
    //                 res.status(404).json({error: err})
    //             })
    //     }else if(addOrRemove === 'remove'){
    //         grouping
    //             .findByIdAndUpdate(groupingId,
    //                 {$pull:
    //                     {TodoIds: todoId}
    //                 },
    //                 {new:true}
    //             )
    //             .then( updated => {
    //                 res.status(200).json(  updated )
    //             })
    //             .catch( err => {
    //                 res.status(404).json({error: err})
    //             })
    //     }
    // }
    static addContributor(req,res,next){
        let {userId, groupingId} = req.params
        grouping
            .findByIdAndUpdate(groupingId,
                {$push:
                    {UserIds:userId}
                },
                {new:true}
            )
            .populate('UserIds')
            .then( updated=>{
                res.status(200).json(updated)
            })
            .catch(next)
    }
    static removeContributor(req,res,next){
        let{userId, groupId} = req.params
        grouping
            .findByIdAndUpdate(groupId,
                {$pull:
                    {
                        UserIds:userId
                    }
                },
                {new:true}
            )
            .then( updated=>{
                res.status(200).json(updated)
            })
            .catch(next)
    }
    static create(req,res,next){
        console.log(req.body.title)
        console.log(req.body, 'contributors')
        let contributors  = JSON.parse(req.body.contributors)

        console.log(contributors)
        let UserIds = []
        let promises = []
        for( let i = 0 ; i < contributors.length; i ++){
            console.log(contributors[i])
            promises.push(user
                .findOne({email:contributors[i]}))
            }
        Promise.all(promises)
                    .then(users =>{
                        console.log(users, 'users')
                        users.forEach(element => {
                            if(element){
                                UserIds.push(element._id)
                            }
                        });
                        let id = ObjectId(req.decoded._id)
                        console.log(id)
                        UserIds.push(id)
                        let{title, description} = req.body
                        let objInput = {
                            title,
                            description,
                            creator:id,
                            UserIds
                        }
                        return grouping
                        .create(objInput)
                    })
                    .then(grouping=>{
                        res.status(200).json(grouping)
                    })
                    .catch(next)
    }
}

module.exports = groupingController