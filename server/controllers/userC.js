const userM = require('../models/userM')
const jwt = require('jsonwebtoken')
const { compare } = require ('../helpers/bcryptjs')
const {OAuth2Client} = require('google-auth-library');

class UserController {
    static register (req,res) {
        let regisData = {
            name : req.body.name,
            userName : req.body.username,
            password : req.body.password,
            email : req.body.email
            
        }
        userM.create(regisData)
            .then(result=> {
                res.status(201).json(result)
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

        userM.findOne({
            userName : loginData.userName
        })
            .then (result=> {
                // console.log (compare(loginData.password, result.password))
                if (result) {
                    console.log (result)
                    if (compare(loginData.password, result.password)){
                        let token = jwt.sign({
                            _id : result._id,
                            username :result.userName,
                            email : result.email
                        },process.env.JWT_SECRET)

                        res.status(200).json({token})
                    }
                    else {
                        throw `Password / username error`
                    }
                }
                else {
                    throw `Password / username error`
                }
            })
            .catch(err=> {
                res.send(500).json({message : `internal server error `})
            })
    }

    static googleLogin(req,res) {
        // console.log ('pake google login')
        
        const client = new OAuth2Client(process.env.GOOGLE_ID);
        client.verifyIdToken({
            idToken: req.body.idToken
        })
            .then(ticket=> {
                const payload = ticket.getPayload();
                userM.findOne({
                    email: payload.email
                })
                    .then(function(found) {
                        if(found){
                            // console.log (found, 'ini found')
                            let token = jwt.sign({
                                username: found.name,
                                _id: found._id,
                                email: found.email
                            },process.env.JWT_SECRET)
                            res.json({
                                token
                            })
                        }else{
                            req.body.username = payload.name
                            req.body.email = payload.email
                            req.body.name = payload.name
                            req.body.password = 'password12345'
                            // console.log(req.body,'ini req body')
                            this.register(req, res)
                        }
                    })
                console.log (payload)
            })
            .catch(err=> {
                res.status(500).json({message : `Internal server error. `})
            })
    }

}

module.exports = UserController