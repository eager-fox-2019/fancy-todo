const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController{

    static register(req, res, next) {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        })
        return newUser.save()
         .then(userInfo =>{
             res.status(201).json(userInfo)
         })
         .catch(next)
    }
    static login(req, res, next){
        var username = req.body.username
        var password = req.body.password
        User.findOne({username: username})
         .then(userFound =>{
            res.locals.userData = userFound
            return bcrypt.compare(password, userFound.password)
         })
         .then(valid =>{
            if(valid){
                const token = jwt.sign({id: res.locals.userData._id, username: res.locals.userData.username, email: res.locals.userData.email}, secret, {expiresIn: "1h"})
                res.status(200).json({"access_token":token})
             }else{
                 throw new Error("Invalid Username/Password")
             }
         })
         .catch(next)
    }
    static googlesignin(req, res, next){
        var payload = null
        client.verifyIdToken({
            idToken: req.body.idtoken,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then(ticket =>{
            payload = ticket.getPayload()
            return User.findOne({email: payload.email})
        })
        .then(userFound =>{
            if(userFound){
                var token = jwt.sign({id: userFound._id, username: userFound.username, email: userFound.username}, secret, {expiresIn: "1h"})
                res.status(200).json({"access_token": token, "username": userFound.username})
            }else{
                var newUser = new User({
                    username: payload.given_name,
                    password: payload.sub,
                    email: payload.email
                })
                newUser.save()
                .then(newUser =>{
                    var token = jwt.sign({id: newUser._id, username: newUser.username, email: newUser.email}, secret, {expiresIn: "1h"})
                    res.status(200).json({"access_token": token, "username": newUser.username})
                })
                .catch(next)
            }
        })
        .catch(next)
    }
}

module.exports = UserController