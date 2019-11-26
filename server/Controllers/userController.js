const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')

class UserController{
    static signup(req, res, next){
        console.log('masuk ke create');
        console.log(req.body.email);
        
        User.findOne({
                email : req.body.email
            })
        .then(found => {
            if(!found){
                let {email, password} = req.body
                let obj = new User({email, password})
                console.log('halo?')
                return obj.save()
            }else{
                throw 'email already taken'
            }
        })
        // console.log('apakah disini?')
        .then(created => {
            console.log('ke save?')
            console.log(created);
            
            res.status(200).json(created)
        })
        .catch(next)
    }
    static login(req, res, next){
        console.log('pasti masuk')
        User.findOne({email : req.body.email})
        .then(found => {
            console.log('ketemu 1')
            if(found){
                bcrypt.compare(req.body.password, found.password, function(err, sucess) {
                    if(sucess){
                        console.log('bro')
                        let payload = {
                            email : found.email,
                            id : found.id
                        }
                        let token = jwt.sign(payload, process.env.JWT_SECRET)
                        res.json({token})
                    }else{
                        console.log('eo')
                        throw ({status : 401, msg : 'wrong inputs'})
                    }
                })
            }else{
                console.log('else luar')
                throw {msg : 'salah uiy'}
            }
        })
        .catch(next)
    }

    static googleSignIn(req, res, next){
        console.log('masuk')
        const client = new OAuth2Client(process.env.Google_id)
        client.verifyIdToken({
            idToken : req.body.idToken
        })
        .then(ticket => {
            console.log(ticket, 'dapet ticket')
            const payload = ticket.getPayload()
            User.findOne({
                email : payload.email
            })
            .then(function(found){
                console.log(found, 'nemu found')
                if(found){
                    let token = jwt.sign({
                        email : found.email,
                        _id : found._id
                    }, process.env.JWT_SECRET)
                    res.json({
                        token
                    })
                }else{
                    console.log('bikin signup')
                    req.body.email = payload.email
                    req.body.password = 'qwertyu'
                    console.log(req.body)
                    UserController.signup(req, res, next)
                }
            })
            console.log(payload)
        })
        .catch(next)
    }
}

module.exports = UserController