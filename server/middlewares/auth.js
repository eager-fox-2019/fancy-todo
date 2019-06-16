const { verify } = require('../helpers/jwt');
const { User } = require('../models');
const { Todo } = require('../models');
const { Project } = require('../models')
const nodemailer = require("nodemailer");
const clientUrl = 'http://localhost:8080'

module.exports = {
  authenticate: function( req, res, next ) {
    let token = req.headers.token;
    if (!token) {
      throw({code : 401, message: 'Unauthorized' })
    } else {
      let decoded = verify(token);
      User
       .findOne({
         email: decoded.email
       })
       .then(user => {
         if(user) {
           req.user = user;
           next();
         } else {
           throw({code : 401, message: 'Unauthorized'})
         }
       })
       .catch(next)
    }
  },
  authorizeTodo: function( req, res, next ) {
    let { id } = req.params;
    let  userId  = req.user._id
    Todo
     .findOne({ _id: id })
      .then(data =>{
          if( data ) {
              if( String(data.userId) == String(userId) ){
                next()
              }else {
                throw({code : 403, message : 'Forbidden'})
              }
          }else {
              throw({code : 400, message : 'Bad request'})
          }
      })
      .catch(next)
  },
  authorizeProject: function( req, res, next ) {
    let { id } = req.params;
    let  userId  = req.user._id
    Project
     .findOne({ _id: id })
      .then(data =>{
          if( data ) {
              if( String(data.userId) == String(userId) ){
                next()
              }else {
                throw({code : 403, message : 'Forbidden'})
              }
          }else {
              throw({code : 400, message : 'Bad request'})
          }
      })
      .catch(next)
  },
  memberAuthenticate : function( req, res, next ) {
    let memberId = req.user._id
    let projectId = req.params.projectId
    Project.findOne({ 
      _id : projectId,
      members :  memberId 
    })
    .then(data =>{
      if(data) {
         next()
        }else {
        throw ({ code : 403, message : 'Forbidden' })
       }
     })
     .catch(next)
  },
  inviteMember : function (req,res,next) {
    User.findOne({ _id: req.body.userId })
    .then(user =>{
        if(!user) {
          throw({ code : 400, message: "Bad Request" })
        }
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
          to: `${user.email}`, // list of receivers
          subject: "Project Invitation", // Subject line
          html: `
            <b>You were added as member from Todoz app.</b>
            <p>PLease accept or decline this invitation from link below</p>
            <a href="${clientUrl}/?userId=${user._id}&projectId=${req.params.id}">Todoz Link </a>
          ` 
        };
        return transporter.sendMail(info)
      })
      .then(data =>{
          res.status(200).json(data)
      })
    .catch(next)
  }
}
