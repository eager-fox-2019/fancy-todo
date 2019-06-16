const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { compare } = require ('../helpers/bcryptjs')
const {OAuth2Client} = require('google-auth-library');

class UserController {
    static register (req,res) {
        let data = {
            name : req.body.name,
            userName : req.body.username,
            password : req.body.password,
            email : req.body.email
            
        }
        User.create(data)
            .then( (newUser) => {
                res.status(201).json(newUser)
            })
            .catch(err=>{
                res.send(err)
            })
    }

    static login (req,res) {
        let loginData = {
            userName : req.body.username,
            password : req.body.password
        }

        User.findOne({
            userName : loginData.userName
        })
        .then ( (user) => {
            if (user) {
                if (compare(loginData.password, user.password)){
                    let token = jwt.sign({
                        _id : result._id,
                        username :result.userName,
                        email : result.email
                    }, process.env.SECRET)
                    res.status(200).json({token})
                }
                else {
                    throw `Password / username is wrong`
                }
            }
            else {
                throw `Password / username is wrong`
            }
        })
        .catch( (err) => {
            res.send(500).json({message : `internal server error, detail: ${err}`})
        })
    }

    static googleAuth(req,res) {        
        const client = new OAuth2Client(process.env.GOOGLE_OAUTH_ID);
        client.verifyIdToken({
            idToken: req.body.idToken
        })
        .then(ticket=> {
            const payload = ticket.getPayload();
            User.findOne({
                email: payload.email
            })
            .then(function(found) {
                if(found){
                    let token = jwt.sign({
                        username: found.name,
                        _id: found._id,
                        email: found.email
                    },process.env.JWT_SECRET)
                    res.status(200).json({token})
                }else{
                    req.body.username = payload.name
                    req.body.email = payload.email
                    req.body.name = payload.name
                    req.body.password = `${payload.name}default`
                    this.register(req, res)
                }
            })
        })
        .catch(err=> {
            res.status(500).json({message : `Internal server error. `})
        })
    }

}

module.exports = UserController