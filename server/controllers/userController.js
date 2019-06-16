const User = require('../models/userModel')
const { verifyPassword } = require('../helpers/bcrypt')
const { createToken } = require('../helpers/jwt')

class UserController {
    static register(req, res, next) {
        let { name, email, password } = req.body
        User.create({
            name, email, password
        })
        .then((newUser) => {
            res.status(201).json(newUser)
        })
        .catch(next)
    }

    static login(req, res, next) {
        let { email, password } = req.body
        User.findOne({
            email
        })
        .then(found => {
            // console.log(found)
            if (found && verifyPassword(password, found.password)) {
                let access_token = createToken({ id: found.id, email: found.email })
                res.status(200).json({
                    token: access_token,
                    id: found.id,
                    name: found.name,
                    email: found.email
                });
            } else {
                next({ status: 400, messages: 'email/password wrong!' })
            }
        })
        .catch(next)
    }

    static getUsers(req, res, next) {
        User.find({})
        .then((users) => {
            res.json(users)
        })
        .catch(next)
    }

    static cekEmail(req, res, next) {
        let email = req.params.email
        User.findOne({
            email
        })
        .then((found) => {
            res.json(found)
        })
        .catch(next)
    }
}

module.exports = UserController