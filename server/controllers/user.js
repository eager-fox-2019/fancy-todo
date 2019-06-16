const User = require('../models/user')
const {sign} = require('../helpers/jwt')
const {decrypt} = require('../helpers/bcrypt')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class ControllerUser {
    static register(req, res, next) {
        let data = {
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        }
        User
            .findOne({
                email: req.body.email
            })
            .then(resp => {
                if (!resp) {
                    User
                        .create(data)
                        .then(resp => {
                            res.status(201).json(resp)
                        })
                        .catch(next)
                } else {
                    throw ({
                        status: 401,
                        msg: "Email Already Used"
                    })
                }
            })
            .catch(next)
    }

    static login(req, res, next) {
        User
            .findOne({
                email: req.body.email
            })
            .then(resp => {
                if (resp) {
                    if (decrypt(req.body.password, resp.password)) {
                        let payload = {
                            id: resp._id,
                            userName: resp.userName,
                            email: resp.email
                        }
                        let token = sign(payload)
                        res.status(200).json({
                            token
                        })
                    } else {
                        throw ({
                            status: 401,
                            msg: "Email/Password Wrong, Try Again"
                        })
                    }
                } else {
                    throw ({
                        status: 404,
                        msg: "User Not Found"
                    })
                }
            })
            .catch(next)
    }

    static googlesignin(req, res, next) {
        client
            .verifyIdToken({
                idToken: req.body.idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            .then(function (ticket) {
                const ticketpayload = ticket.getPayload()
                let data = {
                    userName: ticketpayload.name,
                    email: ticketpayload.email,
                    password: "hehe"
                }
                
                User
                    .findOne({
                        email: ticketpayload.email
                    })
                    .then(resp => {
                        if (resp) {
                            if (decrypt(data.password, resp.password)) {
                                let payload = {
                                    id: resp._id,
                                    userName: resp.userName,
                                    email: resp.email
                                }
                                let token = sign(payload)
                                res.status(200).json({
                                    token
                                })
                            } else {
                                throw ({
                                    status: 401,
                                    msg: "Email/Password Wrong, Try Again"
                                })
                            }
                        } else {
                            User
                                .create(data)
                                .then(resp => {
                                    let payload = {
                                        id: resp._id,
                                        userName: resp.userName,
                                        email: resp.email
                                    }
                                    let token = sign(payload)
                                    res.status(200).json({
                                        token
                                    })
                                })
                                .catch(next)
                        }
                    })
                    .catch(next)
            })
            .catch(next)
    }
}

module.exports = ControllerUser