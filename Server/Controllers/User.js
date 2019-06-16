const User = require("../Models/User.js")
const register = require('../Helpers/Bcrypt.js');
const jwt  = require('../Helpers/Jwt.js');

class UserController{
    static signup(req,res,next){
        let google = req.params.google
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }
        User.create(newUser)
        .then((result) => {
            if (google){
                UserController.signin(req,res,next)
            } else {
                res.status(201).json(result)
            }
        })
        .catch(next)
    }
    static signin(req,res,next){
        let email = req.body.email
        let password = req.body.password
        User.findOne({
            email: email
        })
        .then((result) => {
            if (result){
                let check = register.checkPassword(password, result.password)
                if (check == true){
                    let userSign = {
                        id: result._id,
                        email: result.email,
                        name: result.name
                    }
                    let temp = jwt.sign(userSign)
                    let token = {
                        token: temp
                    }
                    res.status(200).json(token)
                } else {
                   throw `Error: wrong email or password!`
                }
            } else {
                throw `Error: wrong email or password!`
            }
        })
        .catch(next)
    }
    static googleSignin(req,res,next){
        let payload = req.payload
        User.findOne({
            email: payload.email
        })
        .then((result) => {
            if (result){
                let googleSign = {
                    id: result._id,
                    email: result.email,
                    name: result.name
                }
                let temp = jwt.sign(googleSign)
                let token = {
                    token: temp
                }
                res.status(200).json(token)
            } else {
                req.body.name = payload.name
                req.body.email = payload.email
                req.body.password = Math.floor(Math.random() * 9999999999) + 10000000
                req.params.google = true
                UserController.signup(req,res,next)
            }
        })
        .catch(next)
    }
    static signout(req,res,next){
        req.headers = null
        res.status(200).json('User signed out.')
    }
}

module.exports = UserController
