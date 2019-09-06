const jwt = require('../Helpers/Jwt.js')
const User = require('../Models/User.js')
const Todo = require("../Models/Todo.js")
const { OAuth2Client } = require('google-auth-library');

module.exports = {
  Authentication: function (req, res, next){
    let token = req.headers.token
    if(!token){
        throw {
            code: 401,
            message: 'You must login to access this endpoint'
        }
    } else {
        let decoded = jwt.verify(token)
        User.findOne({
            email: decoded.email})
        .then((user) => {
            if (user){
                req.decoded = decoded
                next()
            } else {
                throw {
                    code: 401,
                    message: 'User is not valid'
                }
            }
        })
        .catch(next)  
    }
},
  Authorization: function (req, res, next){
    let id = req.params.id
    Todo.findById(id)
    .then((result) => {
        if (result.UserId == req.decoded.id){
            next()
        } else {
            throw {
                code: 401,
                message: 'Forbidden'
            }
        }
    })
    .catch(next)
  },
  GoogleAuth: function (req, res, next){
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let googleToken = req.body.googleToken
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        req.payload = ticket.getPayload();
        next()
      }
      verify()
      .catch(next);
  }
}