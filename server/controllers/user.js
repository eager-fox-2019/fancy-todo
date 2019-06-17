const User = require('../models/user')
const {compare} = require('../helpers/bcrypt')
const {sign} = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client("862970043761-20gvg559091uv6duj442i64v3d6qra1u.apps.googleusercontent.com ")

class UserController{
    
    static getAll(req,res,next){
        User
        .find({})
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static getOne(req,res,next){
        User
        .findById(req.params.id)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static register(req,res,next){
        let user = new User({
            name : req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        user.save()
        .then(value =>[
            res.status(201).json(value)
        ])
        .catch(next)
    }

    static login(req,res,next){
      console.log('masuk')
        User
        .findOne({email : req.body.email})
        .then(user =>{
          console.log('ini user',user);
          
            if(user){
                console.log('ini user',user);
                if(compare(req.body.password,user.password)){
                    let payload = {
                        email : user.email,
                        id : user._id,
                        name: user.name
                    }
                    let token = sign(payload)
                    res.status(200).json({
                        token,
                        name: user.name,
                        email : user.email,
                        id : user._id
                    })
                }else {
                    console.log('masuk error 1');
                    
                    throw { code : 404, msg : `username/password salah`}
                }  
            }else{
                console.log('masuk error 2');
                
                throw { code : 404, msg : `username/password salah`}
            }
        })
        .catch(next)
    }

    static loginGoogle(req,res,next){
        client
        .verifyIdToken({
            idToken: req.body.idToken,
            audience: "862970043761-20gvg559091uv6duj442i64v3d6qra1u.apps.googleusercontent.com",
        })

        .then(function(ticket){
            console.log(ticket)
            const { email, name, picture } = ticket.getPayload()

            let password= name+'fancyTodo'
            let newUser={
                name: name,
                email: email,
                password: password
            }

            User.findOne({email: email})
            .then(user=>{
                if(user){
                    console.log(user)
                    let payload = {
                        id : user._id,
                        name: user.name,
                        email : user.email
                    }

                    let token = sign(payload)
                    res.status(200).json({
                        token,
                        name : user.name,
                        email : user.email,
                        id : user._id
                    })

                }else{
                    User.create(newUser)
                    .then(user=>{
                        let payload = {
                            id : user._id,
                            name: user.name,
                            email : user.email
                        }

                        let token = sign(payload)

                        res.status(200).json({
                            token,
                            name : user.name,
                            email : user.email,
                            id : user._id
                        })
                    })
                    .catch(next)  
                }
            })
            .catch(next)
        })
        .catch(next)
    }

    static update(req,res,next){
        let setVal = {}
        req.body.firstName && (setVal.firstName = req.body.firstName) 
        req.body.lastName && (setVal.lastName = req.body.lastName)
        req.body.email && (setVal.dueDate = req.body.dueDate)
        
        User
        .findById(req.params.userId)
        .then(user =>{
            user.set(setVal)
            return user.save()
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req,res,next){
        User
        .findByIdAndDelete(req.params.id)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }


}

module.exports = UserController