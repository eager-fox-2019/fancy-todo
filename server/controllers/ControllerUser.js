const User = require('../models/modelUser')
const Token = require('../models/modelBlacklistToken')
const { compareHash } = require('../helpers/hashHelpers')
const { generateToken, decodeToken } = require('../helpers/jwtHelper')
const { customPassword } = require('../helpers/passwordGenerator')

// Google Sign in setting
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

class ControllerUser {
  static login(req, res, next) {
    let payload, token, userId
    let googlePayload
    let googleToken = req.body.google_id_token

    if (googleToken) {
      // Login using google
      client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.CLIENT_ID,
      })
        .then((ticket) => {
          googlePayload = ticket.getPayload();
          userId = googlePayload['sub'];
          return User.findOne({ username: userId })
        })
        .then((result) => {
          if (result) {
            payload = {
              userId: result._id
            }
            token = generateToken(payload)
            res.status(200).json({
              token: token,
              full_name: result.full_name
            })
          } else {
            let randomPass = customPassword()
            return User.create({
              full_name: googlePayload.name,
              username: userId, 
              password: randomPass,
              email: googlePayload.email,
            })
          }
        })
        .then((result) => {
          if (result){
            payload = {
              userId: result._id
            }
            token = generateToken(payload)
            res.status(200).json({ 
              token: token,
              full_name: result.full_name 
            })
          }
        })
      .catch(console.error);
    } else {
      // Login default
      let { username, password } = req.body
      let userData
      User.findOne({ username: username })
        .then((user) => {
          userData = user
          if (!user) next({code: 401, message: 'Username / password Invalid'})
          else {
            return compareHash(password, user.password)
          }
        })
        .then(result => {
          if (!result) next({code: 401, message: 'Username / password Invalid'})
          else {
            let payload = {
              userId: userData._id
            }          
            let token = generateToken(payload)
            res.json({
              token: token,
              full_name: userData.full_name,
            })
          }
        })
        .catch(next)
    }
  }
  
  static logout(req, res, next) {
    let token = req.headers.token
    Token.create({ token: token })
      .then((token) => {
        res.status(201).json({ message: 'Successfully log out' })
      })
      .catch(next)
  }

  static register(req, res, next) {
    if (!req.body.username || !req.body.password || !req.body.email) {
      throw { code: 404, message: 'Please input username / password / email'}
    }
    let schemaField = Object.keys(User.prototype.schema.paths)
    let filteredField = Object.keys(req.body).filter((x) => schemaField.indexOf(x) > -1)
    let newUser = filteredField.reduce((acc, el) => Object.assign(acc, {[el]: req.body[el]}), {})
    User.create(newUser)
      .then((user) => {
        console.log('success register');
        res.status(201).json(user)
      })
      .catch(next)
  }

  static profileData(req, res, next) {
    let payload = decodeToken(req.headers.token)
    User.findOne({ _id: payload.userId })
      .then((result) => {
        let fieldRespon = ['full_name', 'username', 'email']
        let sendRespon = fieldRespon.reduce((acc, el) => Object.assign(acc, {[el]: result[el]}), {})
        res.json(sendRespon)
      })
      .catch((err) => {
        console.log(err);
        next()
      })
  }
}

module.exports = ControllerUser