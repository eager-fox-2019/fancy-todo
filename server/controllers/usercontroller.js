const User = require('../models/user')
const {verifyPassword} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generatePassword = require('../helpers/password')

class UserController {
  static signUp(req,res,next){
    const {email, password} = req.body
    const input = {email, password}
    User.create(input)
      .then(newUser => {
        res.status(200).json(newUser)
      })
      .catch(next)
  }

  static signIn(req,res, next) {
    User.findOne({
      email: req.body.email
    })
      .then(user => {
        if(user) {
          if(verifyPassword(req.body.password, user.password)) {
            const payload = {
              email : user.email,
              id: user.id
            }
            const token = generateToken(payload)
            res.status(200).json({
              accessToken: token
            })
          }
          else{
            next()
          }
        }
        else{
          next()
        }
      })
      .catch(next)
  }

  static googleToken(req,res,next) {
    // console.log('test====')
    client
      .verifyIdToken({
        idToken: req.body.idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      .then(function(ticket){
        const {email} = ticket.getPayload()

        
        const password = generatePassword()
        
        User.findOne({
          email: email
        })
          .then(user => {
            // console.log(user)
            if(user) {
              const payload = {
                email : user.email,
                id: user.id
              }
              const token = generateToken(payload)
              res.status(200).json({
                accessToken: token
              })
            }
            else{
              User.create({
                email: email,
                password: password
              })
                .then(newUser => {
                  const payload = {
                    email : newUser.email,
                    id: newUser.id
                  }
                  const token = generateToken(payload)
                  // console.log(newUser)
                  res.status(200).json({
                    accessToken: token
                  })
                })
                .catch(next)
            }
          })
      })
      .catch(next)
  }
}

module.exports = UserController