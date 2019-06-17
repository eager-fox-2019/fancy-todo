const { Todo } = require('../models')
const CronJob = require('cron').CronJob;
const { nodeMailer } = require('../helpers/nodemailer')

new CronJob("0 */6 * * * ", function() {
    Todo.find({
        projectId : undefined
    })
    .populate('userId')
    .then(data =>{
        data.forEach(el =>{
            if(Number(el.dayLeft) < 2 && Number(el.dayLeft) > 0) {
                return nodeMailer(el)
            }
        })
        throw('no deadline today')
    })
    .then(data =>{
        console.log('send cron after 6 hours succesfully')
    })
    .catch(err =>{
        console.log(err)
    })
}, null, true, 'America/Los_Angeles');

class ControllerTodo {

    static create(req,res,next) {
        let userId = req.user.id
        let value = { ...req.body, ...{ userId } }
        let newTodo = new Todo ({
            title : value.title,
            description : value.description,
            due_date : value.due_date,
            userId : value.userId,
            projectId : value.projectId
        })
        newTodo.save()
        .then(data =>{
            res.status(201).json(data)
        })
        .catch(next)
    }
    static findAll(req,res,next) {
        let userId = req.user._id
        Todo.find( { 
            userId,
            projectId : undefined
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(next)
    }
    static findOne(req,res,next) {
        Todo.findOne({ _id: req.params.id })
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }
    static update(req,res,next) {
        let value = { ...req.body }
        Todo.findOneAndUpdate({ _id : req.params.id }, value , { new : true })
        .then(data =>{
            if(!data) {
                throw({ code :400, message: "Bad Request" })
            }else {
                res.status(200).json(data)
            }
        })
        .catch(next)
    }
    static delete(req,res,next) {
        Todo.findOneAndDelete({ _id : req.params.id })
        .then(data =>{
            res.status(200).json({
                message : 'Deleted todo successfully'
            })
        })
        .catch(next)
    }
}
module.exports = ControllerTodo