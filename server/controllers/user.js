const { hash } = require('../helpers/bcryptjs')
const { compare } = require('../helpers/bcryptjs')
const { sign } = require('../helpers/jwt')
const { User } = require('../models')
const {OAuth2Client} = require('google-auth-library');

class ControllerUser {
    static login(req, res, next) {
        let { email, password } = req.body
        User
         .findOne({ email })
         .then(user => {
             if (!user) {
                throw({ code : 400, message: 'Username/ password invalid' })
             }else {
                 if (!compare(password, user.password)) {
                    throw({ code : 400, message: 'Username/ password invalid' })
                 } else {
                   let token = sign({email: user.email})
                   res.status(200).json({ token, name : user.name, id : user._id })
                 }
             }
         })
         .catch(next)
    }
    static create (req,res, next) {
        let { email, password, name } = req.body
        let hashed = hash(password)
        User
         .create({
             name,
             email,
             password : hashed
         })
         .then(data =>{
             let token = sign({email: data.email})
             res.status(201).json({ token, name : data.name, id : data._id })
         })
         .catch(next)
    }
    static findAll ( req, res, next ) {
        User.find()
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    } 
    static googleLogin(req, res, next) {
        let client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID);
        let token = req.body.id_token
        client.verifyIdToken({
            idToken: token,
        })
        .then(ticket =>{
            let payload = ticket.getPayload();
            return User.findOne({ email: payload.email })
            .then(user =>{
                if(user) {
                    let token = sign({ email: user.email })
                    res.status(200).json({ token, name : user.name, id : user._id })
                }else {
                    return User.create({
                        name : payload.name,
                        email : payload.email,
                        password : '_googlePass'
                    })
                    .then(user =>{
                        let token = sign({ email: user.email })
                        res.status(200).json({ token, name : user.name, id : user._id })
                    })
                }
            })
        })
        .catch(next)
    }
}
module.exports = ControllerUser