const User = require('../models/').User
const Todo = require('../models/').Todo
const verifyPassword = require('../helpers/bcrypt.js').verifyPassword
const generateToken = require('../helpers/jwt.js').generateToken
const verifyToken = require('../helpers/jwt.js').verifyToken
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class ControllerUser {
  static update(req, res, next){
    let userEmail = req.decode
    let {name, password} = req.body
    let input = {name, password} //user cannot change email

    User.findOneAndUpdate({email: userEmail}, input, {new: true})
    .then(updated => {
      console.log(updated)
      res.json(updated)
    })
    .catch(next)
  }

  static delete(req, res, next){
    let userEmail = req.decode
    User.findOneAndDelete({email: userEmail})
    .then(deleted => {
      res.json(deleted)
    })
    .catch(next)
  }

  static delById(req, res, next){
    let userId = req.params.userId //5d04beb3c477da27a86114c9
    
    User.findOneAndDelete({_id: userId})
    .then(deleted => {
      res.json(deleted)
    })
    .catch(next)
  }

  static currentUser(req, res, next){
    let userEmail = req.decode
    .then(found => {
      if (found) {
        console.log("currentUser ControllerUser")
        console.log(found)
        res.json(found)
      } else {
        throw new Error('no user logged in')
      }
    })
    .catch(next)
  }

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

  static fbSignin(req, res, next){
    const { name, email, password } = req.body
    const input = { name, email, password }
    let token

    User.findOne({email: input.email})
    .then(found=> {
      if (found){
        //not firsttime login
        return
      } else {
        console.log("new fb user")
        return User.create(input)
      }
    })
    .then(() => {
      console.log("fb login")
      token = generateToken(email)
      res.json({email, token})
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

        const {email, at_hash} = ticket.getPayload()
        newEmail = email
        password = at_hash
        token = generateToken(email)
        return User.findOne({email: newEmail})
      })
      .then(result => {
        if(result) {
          return 
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