const User = require('../models/').User
const Todo = require('../models/').Todo
const verifyPassword = require('../helpers/bcrypt.js').verifyPassword
const generateToken = require('../helpers/jwt.js').generateToken
const verifyToken = require('../helpers/jwt.js').verifyToken
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class ControllerUser {

  static findAll(req, res, next) {
    User.find()
    .then(result => {
      res.json(result)
    })
    .catch(next)
  }

  static create(req, res, next) {
    const { name, email, password } = req.body
    const input = { name, email, password }
    User.create(input)
    .then(result => {
      res.json(result)
    })
    .catch(next)
  }

  static login(req, res, next) {
    const { email, password } = req.body
    const input = { email, password }

    User.findOne({email: input.email})
    .then(user => {
      if(user){
        let check = verifyPassword(input.password, user.password)
        if(check) {
          let token = generateToken(email)
          res.json(token)
        } else {
          throw {status: 400, message: 'Wrong password'}
        }
      } else {
        throw {status: 400, message: 'Wrong email'}
      }
    })
    .catch(next)
  }

  static googleSignin(req, res, next) {
    let newEmail
    let password
    let token
    client
      .verifyIdToken({
        idToken: req.body.idToken,
        audience: process.env.GOOGLE_CLIENT
      })
      .then(ticket => {
        const {email} = ticket.getPayload()
        newEmail = email
        password = getPassword(email)
        token = getToken(email)

        return User.findOne({email: newEmail})
      })
      .then(result => {
        if(result) {
          res.json({newEmail, token})
        } else {
          return User.create({
            name: newEmail.split('@')[0],
            email: newEmail,
            password: password
          })
        }
      })
      .then(() => {
        res.json({newEmail, token})
      })
      .catch(next)
  }
}

module.exports = ControllerUser