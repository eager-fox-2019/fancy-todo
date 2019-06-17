const Helper = require('../helpers/helper')
const User = require('../models/user')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


class UserController {

  static register(req, res) {
    let input = {
      email: req.body.email,
      password: req.body.password
    }

    User
      .create(input)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => {
        if (err.errors.email) {
            res.status(409).json({ err: err.errors.email.reason });
        } else if(err.errors.password) {
            res.status(409).json({ err: err.errors.password.message });
        } else {
            res.status(500).json(err);
        }
      })
  }

  static login(req, res) {
    User.findOne({ 'email': req.body.email }) 
      .then(user => {
        let cekPass = false
        if (user) {
            console.log(user)
          cekPass = Helper.comparePassword(req.body.password, user.password)
          console.log(cekPass)
          if (!cekPass) {
            res.status(400).json({ message: 'invalid username or password' })
          } else {
            let token = Helper.generateJWT({ email: user.email, _id: user._id});
            console.log(token); 
            res.status(200).json({ token })
          }
        } else {
            res.status(400).json({ err: "Username/Password wrong" });
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static loginGoogle(req, res) { 
    var newEmail = ''
    client.verifyIdToken({
      idToken: req.headers.token,
      audience: process.env.CLIENT_ID
    })
      .then(function (ticket) {
        newEmail = ticket.getPayload().email
        return User.findOne({
          email: newEmail
        })
      })
      .then(function (userLogin) {
        console.log('masuk ke then 2')
        if (!userLogin) {
          return User.create({
            email: newEmail,
            password: 'password',
          })
        } else {
          return userLogin
        }
      })
      .then(function (newUser) {
        console.log('masuk ke then 3')
        let token = Helper.generateJWT({ email: newUser.email, _id: newUser._id}, process.env.SECRET);
        res.status(200).json({ token })
      })
      .catch(function (err) {
        console.log(err)
        res.status(500).json(err)
      })
  }

}

module.exports = UserController