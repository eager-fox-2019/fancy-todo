const User = require("../models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class userController {

    static async getAll(req, res, next) {
        try {
            let users = await User.find({})
            let newArr = []
            users.forEach(user => {
                if (user._id != req.loggedUser.id) {
                    newArr.push({
                        _id: user._id,
                        email: user.email
                    })
                }
            })
            res.json(newArr)
        } catch (error) {
            next(error)
        }
    }

    static async register(req, res, next) {
        let newUser = new User({
            email: req.body.email,
            password: req.body.password
        })
        try {
            res.json(await newUser.save())
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            let user = await User.findOne({
                email: req.body.email
            })
            if (user) {
                let isValid = bcrypt.compareSync(req.body.password, user.password)
                if (isValid) {
                    let token = jwt.sign({
                        username: user.username,
                        email: user.email,
                        id: user._id
                    }, process.env.JWT_SECRET)
                    res.json({
                        token,
                        username: user.username,
                        email: user.email,
                        id: user._id
                    })
                } else {
                    throw ({
                        code: 400,
                        message: "wrong email/password"
                    })
                }
            } else {
                throw ({
                    code: 404,
                    message: "wrong email/password"
                })
            }
        } catch (error) {
            next(error)
        }
    }

    static googleLogin(req, res, next) {
        const {
            OAuth2Client
        } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let googleToken = req.body.googleToken

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            console.log(payload)
            User.findOne({
                    email: payload.email
                })
                .then((user) => {
                    if (user) {
                        let token = jwt.sign({
                            username: user.username,
                            email: user.email,
                            id: user._id
                        }, process.env.JWT_SECRET)
                        res.json({
                            token,
                            username: user.username,
                            email: user.email,
                            id: user._id
                        })
                    } else {
                        req.body.email = payload.email
                        req.body.password = "password12345"
                        userController.register(req, res, next)
                    }
                })
                .catch(next)
        }
        verify()
            .catch(next);
    }

}

module.exports = userController