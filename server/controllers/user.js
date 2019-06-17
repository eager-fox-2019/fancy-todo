const User = require('../models/user')
const { compareSync } = require('../helpers/hashPass')
const { sign } = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserCont {
  static read(req, res, next) {
    let obj = {}
    if(req.query.email)
      obj.email = { '$regex' : req.query.email, '$options' : 'i' }
    User.find(obj)
      .sort({ email: 1 })
      .then(rows => {
        // rows = rows.filter(row => !row._id.equals(req.decoded._id))
        res.json(rows)
      })
      .catch(next)
  }

  static GoogleSignIn(req, res, next) {
    let payload = null
    let newPass = null
    let code = 500
    client.verifyIdToken({
      idToken: req.body.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
      .then((ticket) => {
        payload = ticket.getPayload();
        const userid = payload['sub']
        return User.findOne({ email: payload.email })
      })
      .then((row) => {
        if (!row) {
          code = 201
          newPass = randomPass()
          return User.create({
            name: payload.name,
            email: payload.email,
            password: newPass
          })
        }
        code = 200
        return row
      })
      .then(row => {
        payload = {
          _id: row._id,
          name: row.name,
          email: row.email
        }
        let data = {
          'access-token': sign(payload, process.env.KUNCI),
          _id: row._id,
          name: row.name,
          email: row.email
        }
        if (newPass) data.newPass = newPass
        res.status(code).json(data)
      })
      .catch(next)
  }

  static register(req, res, next) {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then(row => {
        res.status(201).json(row)
      })
      .catch(next)
  }

  static login(req, res, next) {
    if(req.body.password.length < 8)
      next({ code: 400, message: 'Password must be more than equal 8 character!' })
    User.findOne({
      email: req.body.email,
    })
      .then(row => {
        if (row) {
          let isSame = compareSync(req.body.password, row.password)
          if (isSame) {
            let payload = {
              _id: row._id,
              name: row.name,
              email: row.email
            }
            let data = {
              'access-token': sign(payload, process.env.KUNCI),
              _id: row._id,
              name: row.name,
              email: row.email
            }
            res.status(200).json(data)
          }
          else next({ code: 422, message: 'Wrong email/password' })
        }
        else
          next({ code: 422, message: 'Wrong email/password' })
      })
      .catch(next)
  }
}

module.exports = UserCont