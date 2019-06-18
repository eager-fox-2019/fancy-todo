const nodemailer = require("nodemailer");
const clientUrl = `${process.env.CLIENT_URL}`

module.exports = {
    nodeMailer : function(todo) {
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
            to: `${todo.userId.email}`, // list of receivers
            subject: "ALERT", // Subject line
            html: `
                <h1> Check your todo list of today </h1>
                <b>${todo.title}</b>
                <p>${todo.description}</p>
                <a href="${clientUrl}"> Check Todoz app. <a>                        
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
