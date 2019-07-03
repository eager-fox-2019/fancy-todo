const todo = require('../models/todoModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const grouping = require('../models/groupingModel')
const {nodeMailer} = require('../helper/nodeMailer')
const CronJob = require('cron').CronJob
new CronJob('* 1 0 * * *', function() {
    todo
        .find()
        .populate('UserId')
        .populate('ProjectId')
        .then(todo=>{
            todo.forEach((item)=>{
                if(item.reminder){
                    item.reminder.setHours(0,0,0,0)
                    let today = new Date()
                    today.setHours(0,0,0,0)
                    // console.log(item.reminder)
                    // console.log(today)
                    if(!item.status){
                        if(today.getTime() === item.reminder.getTime()){
                            
                            nodeMailer(item.UserId.email, {title:item.title})
                            .then(response=>{
                                console.log(response)
                            })
                            .catch(console.log)
                        }
                    }
                }
            })
            
            // if(todo.reminder.getDate)
            console.log(todo)
        })
        .catch(console.log)
}, null, true, 'America/Los_Angeles');

class todoController{
    static findAll(req,res){
        console.log('findall')
        let output = []
        // console.log('hai')
        let id = ObjectId(req.decoded._id)
        todo
            .find({ UserId: id })
            .then(todo =>{
                // console.log('hello di controller')
                // console.log(todo)
                output.push(todo)
                console.log(todo, '1')
                // console.log(output, '<<--- output part1')
                return (grouping . find({UserIds:id}))
                // res.status(200).json( todo)
            })
            .then(grouping=>{
                console.log(grouping, '1')
                let projectIds = []
                for( let i = 0; i < grouping.length; i++){
                    projectIds.push(grouping[i]._id)
                }
                let promise = projectIds.map((element)=>{
                    return todo.find({ProjectId:element})
                })
                return Promise.all(promise)
            })
            .then(result=>{
                // console.log(result)
                // res.send('hello')
                let temp = []
                console.log(result, 'resullllttt')
                if(result[0]){
                    for ( let i = 0; i < result[0].length; i++){
                        console.log(result[0], 'result')
                        for( let j = 0 ; j < output[0].length; j++){
                            // console.log(result[i], result, i)
                            // console.log(output[0][j], 'output', j)
                            if(result[0][i]._id.equals(output[0][j]._id)){
                                console.log('sini', i)
                                j = output[0].length
                            }
                            if(j == output[0].length -1){
                                console.log('kok gak masuk')
                                temp.push(result[0][i])
                                // console.log(temp)
                            }
                        }
                    }

                }
                if(temp[0]){
                    // console.log(temp, '<< temp')
                    for(let i = 0; i < temp.length; i++){
                        output[0].push(temp[i])
                    }
                }
                res.send(output[0])
            })
            .catch( err => {
                console.log('ini error')
                console.log(err)
                res.status(500).json({error: err})
            })
    }
    static findOne(req,res){
        let id = ObjectId(req.decoded._id)
        let todoId = ObjectId(req.params.todoId)
        todo
            .findOne({ 
                UserId: id, 
                _id: todoId
            })
            .populate('ProjectId')
            .then( todo =>{
                res.status(200).json(todo)
            })
            .catch( err => {
                res.status(500).json({error: err})
            })
    }
    static create(req,res){
        console.log('berhasil create')
        let id = ObjectId(req.decoded._id)
        let objInput = {}
        if(req.body.ProjectId){
            objInput = {
                title: req.body.title,
                due_date: null,
                reminder: null,
                UserId: id,
                status: 0,
                ProjectId: req.body.ProjectId 
            }
        }else{
            objInput = {
                title: req.body.title,
                due_date: null,
                reminder: null,
                UserId: id,
                status: 0,
            }
        }
        todo
            .create(objInput)
            .then( todoCreated =>{
                res.status(200).json(todoCreated)
            })
            .catch( err => {
                console.log(err)
                res.status(500).json(err)
            })
    }
    static update(req,res){
        let todoId = req.params.todoId
        todo
            .findById(todoId)
            .then(user =>{
                user.set(req.body)
                return user.save()
            })
            .then(updatedUser =>{
                res.status(200).json(updatedUser)
            })
            .catch(err=>{
                res.status(500).json(err)
            })
    }
    
    static delete(req,res){
        let todoId = req.params.todoId
        todo
            .findByIdAndDelete(todoId/*id*/)
                .then( deleted => {
                    res.status(200).json(deleted)
                })
                .catch( err => {
                    res.status(404).json({error: err})
                })
    }

}

module.exports = todoController