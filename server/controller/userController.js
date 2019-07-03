const User = require('../models/userModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('1056185331186-91l3oas8aoj68kvg1eni03q58fsh0qnf.apps.googleusercontent.com');
const randomPassword = require('../helper/randomPass')

class userController{
    static authentication(req,res,next){
        res.status(200).json(req.decoded)
    }
    static googleSignIn(req, res, next) {
        let payload = null
        let newPass = null
        client.verifyIdToken({
          idToken: req.body.token,
        })
          .then((ticket) => {
            payload = ticket.getPayload();
            const userid = payload['sub']
            console.log('payload', payload)
            console.log('userId', userid)
            return User.findOne({ email: payload.email })
          })
          .then(user => {
            if (!user) {
              newPass = randomPassword()
              return User.create({
                name: payload.name,
                email: payload.email,
                password: newPass
              })
            } else {
              return user
            }
          })
          .then(user => {
            
            let payload = {
              _id: user._id,
              name: user.name,
              email: user.email
            }
            let token = jwt.sign(payload, process.env.SECRET_SAUCE) //don't forget to use .env
            res.status(200).json({
                data: user, 
                token: token
            })
          })
          .catch(next)
      }
    static findLoggedUser(req,res){
        let id = ObjectId(req.decoded._id)
        User
            .findById(id)
            .then( user =>{
                res.status(200).json({ data: user})
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }

    static findOtherUser(req,res){
        let id = ObjectId(req.params.userId)
        User
            .findById(id)
            .then(user=>{
                res.status(200).json({data: user})
            })
            .catch(err =>{
                res.status(404).json({error: err})
            })
    }
    
    static deleteUser(req, res){
        let id = ObjectId(req.decoded._id)
        User   
            .findOneAndDelete({ id : id })
            .then( deletedUser => {
                res.status(200).json({data: deletedUser})
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }

    static updateInfoUser(req,res){
        let id = ObjectId(req.decoded._id)
        User
            .findById(id)
            .then(user =>{
                user.set(req.body)
                return user.save()
            })
            .then(updatedUser =>{
                res.status(200).json({data: updatedUser})
            })
            .catch(err => {
                res.status(404).json({error: err})
            })
    }

    static signin(req, res){
        let email = req.body.email
        console.log('lagi signin')
        console.log(email)
        User
            .findOne({email:email})
            .then((oneUser)=>{
                console.log(oneUser)
                if(oneUser){
                    if(bcrypt.compareSync(req.body.password, oneUser.password)){
                        let payload = {
                            _id : oneUser._id,
                            name: oneUser.name,
                            email : oneUser.email
                        }
                        let token = jwt.sign(payload, process.env.SECRET_SAUCE) //don't forget to use .env
                        
                        res.json({
                            data: oneUser,
                            token: token
                        })
                    } else {
                        res.status(400).json({msg: 'password/user wrong'})
                    }
                }else{
                    res.status(400).json({msg:'password/user wrong'})
                }
            })
            .catch((err)=>{
                console.log(err)
                res.status(404).json({error:err})
            })
    }

    static signup(req, res){
        let inputObj = {
            name: req.body.name,
            // username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }
        User
            .create(inputObj)
            .then((newUser)=>{
                res.status(200).json(newUser)
            })
            .catch( err => {
                res.status(400).json({error: err})
            })
    }
    
}

module.exports =  userController