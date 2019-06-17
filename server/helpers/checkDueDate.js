const Todo = require('../models/Todo')
const User = require('../models/User')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: `${process.env.GOOGLE_EMAIL}`,
           pass: `${process.env.GOOGLE_PASS}`
       }
})


// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/todoApps', {useNewUrlParser: true})
// .then(() =>{
//       console.log('MongoDB connected')
// })
// .catch(err =>{
//       console.log(err)
// })

function checkDueDate(){
    let timeNow = new Date()
    Todo.find({})
    .then((gotData)=>{
        for (let i = 0; i < gotData.length; i++) {
            let diff = gotData[i].dueDate - timeNow
            let mm = Math.floor(diff / 1000 / 60);
            if(mm <= 30 && mm >= 0){
                User.findById(gotData[i].UserId)
                .then((gotUser)=>{
                    const emailCont = `Hai ${gotUser.first_name} This is a reminder about your task <b>"${gotData[i].name}"</b>  by ${gotData[i].dueDate.toString()}. `
                    const mailOptions = {
                        from: 'HackTodo@admin.com', // sender address
                        to: `${gotUser.email}`, // list of receivers
                        subject: 'HackTodo Reminder', // Subject line
                        html: emailCont
                    };
                    // console.log(emailCont);
                    
                    transporter.sendMail(mailOptions, function (err, info) {
                        if(err){
                            console.log(err);
                        } else {
                            console.log(info);
                        }
                    })
                })
                .catch((err)=>{
                    console.log(err);
                })
            } 
        }
    })
    .catch((gotData)=>{
        console.log(gotData)
    })
}
// checkDueDate()
module.exports = checkDueDate