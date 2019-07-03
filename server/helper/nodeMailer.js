const nodemailer = require('nodemailer');
require('dotenv').config()
const clientUrl = `${process.env.CLIENT_URL}`
console.log(process.env.CLIENT_URL)
module.exports = {
    nodeMailer : function(email,data) {
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: `${process.env.NODE_MAILER_USER}`, // generated ethereal user
            pass: `${process.env.NODE_MAILER_PASS}` // generated ethereal password
            }
        });
        let info = {
                from: `"'todo" <${process.env.NODE_MAILER_USER}>`, // sender address
                to: `${email}`, // list of receivers
                subject: "ALERT", // Subject line
                html: `
                    <h1> Reminder from 'todo ! </h1>
                    <h4> ${data.title} is due by tomorrow</h4>
                    <a href="${clientUrl}"> Click this link to check the details <a>                        
                ` 
            };
        return new Promise(( res, rej )=>{
            transporter.sendMail(info)
            .then(data =>{
                res(data)
            })
            .catch(err =>{
                rej(err)
            })
        }) 
    }

}