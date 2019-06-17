const User = require('../models/user')
const Todo = require('../models/todo')
const Helper = require('../helpers/helper')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID);

class UserController {
    static signup(req, res) {        
        const {email, password, name} = req.body

        User.create({
            name, email, password
        })
        .then(user=> {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({msg: err})
        })
    }

    static list(req, res) {
        User.find({})
        .then(user=> {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({msg:err})
        })
    }

    static signin(req, res) {
        const {email, password} = req.body

        User.findOne({
            email
        })
        .then(user => {
            if(!user) {
                res.status(401).json('Username/password wrong')
            } else {
                if( Helper.comparePassword(password, user.password) ) {
                    let token = Helper.generateJWT({
                        email: user.email,
                        name: user.name,
                        id: user._id
                    });

                    let finalToken = {
                        token,
                        id: user._id,
                        name: user.name,
                        email: user.email
                    };

                    res.status(200).json(finalToken)
                }else{
                    res.status(401).json('Username/password wrong')                
                }
            }
        })
        .catch(err => {
            res.status(500).json({msg: err})
        })
    }

    static signInGoogle(req, res) {
        let newEmail = ''
        let newName = ''

        client.verifyIdToken({
                idToken: req.headers.token,
                audience: process.env.CLIENT_ID
            })
            .then(function(ticket) {
                newEmail = ticket.getPayload().email
                newName = ticket.getPayload().name
                return User.findOne({
                    email: newEmail
                })
            })
            .then(function(userLogin) {
                if (!userLogin) {
                    return User.create({
                        name: newName,
                        email: newEmail,
                        password: 'password'
                    })
                } else {
                    return userLogin
                }
            })
            .then(function(newUser) {
                let token = Helper.generateJWT({
                    email: newUser.email,
                    name: newUser.name,
                    id: newUser._id
                });

                let obj = {
                    token,
                    id: newUser._id,
                    name: newUser.name
                }
                res.status(200).json(obj)
            })
            .catch(function(err) {
                res.status(500).json(err)
            })
    }

    static createToto(req, res) {
        const {name, description, status, due_date} = req.body

        Todo.create( {
            name,
            description,
            status,
            due_date,
            owner: localStorage.id
        } )
        .then(todo=> {
            res.status(201).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static findUserTodo(req, res) {
        const id=req.params.todoId

        Todo.find({owner:id})
        .then(todos=> {
            res.status(201).json(todos)
        })
        .catch(err => {
            res.status(500).json(err)
        })

    }
}

module.exports = UserController
