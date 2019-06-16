const { Todo } = require('../models')
const CronJob = require('cron').CronJob;
const nodemailer = require("nodemailer");
const clientUrl = 'http://localhost:8080'

new CronJob("* */3 * * *", function() {
  Todo.find({
    projectId : undefined
    })
    .populate('userId')
    .then(data =>{
        data.forEach(el =>{
            if(el.due_date < 2 && el.due_date > 0) {
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                      user: `${process.env.NODE_MAILER_USER}`, // generated ethereal user
                      pass: `${process.env.NODE_MAILER_PASS}` // generated ethereal password
                    }
                  });
                  let info = {
                    from: `"TODOZ" <${process.env.NODE_MAILER_USER}>`, // sender address
                    to: `${el.userId.email.email}`, // list of receivers
                    subject: "ALERT", // Subject line
                    html: `
                        <h1> Check your todo list of today </h1>
                        <b>${el.title}</b>
                        <p>${el.description}</p>
                        <a href="${clientUrl}"> Check Todoz app. <a>                        
                    ` 
                  };
                  return transporter.sendMail(info)
                  .then(data =>{
                      console.log(data)
                  })
            }
        })
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