const { match } = require('../helpers/password.helper')
const jwt = require('../helpers/jwt.helper')
const User = require('../models/user')
const axios = require('axios')
class Controller {
    static async login (req, res, next) {
        let { email, password } = req.body
        let errMsg = { code: 400, msg: 'invalid email / pass' }
        try {
            let user = await User.findOne({email}).exec()
            if (user && match(password, user.password)) {
                let token = jwt.sign({user: user._id})
                res.json({access_token: token})
            } else {
                next(errMsg)
            }
        } catch (err) {
            console.log('login error', err)
            next(errMsg)
        }
    }

    static async register (req, res, next) {
        let { email, password } = req.body
        try {
            let user = await User.create({email, password})
            let { _id } = user
            res.json({_id, email, password})
        } catch (err) {
            console.log('register error', err)
            if (err.code === 11000){
                next({code: 400, msg: "email already exists, "+email})
            } else {
                next({code: 400, msg: err.message})
            }
        }
    }

    static async loginGithub(req, res, next) {
        let { code } = req.body
        try {
            /**
             * ambil access token dari github 
             */
            let githubToken = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
                client_secret: process.env.GITHUB_OAUTH_SECRET,
                code,
                redirect_uri: 'https://khasburrahman.github.io/fancy-todo/'
            }, {
                    headers: {
                        'Accept': 'application/json'
                    }
                })
            let { access_token } = githubToken.data

            /**
             * ambiil data username dari github
             */
            let userEmails = await axios.get(`https://api.github.com/user/emails`, {
                headers: {
                    'Authorization': `token ${access_token}`
                }
            })
            let responseEmails = userEmails.data
            let email = responseEmails[0] && responseEmails[0].email || null
            if (!email) {
                next({code: 400, msg: `this github user doesn't have email address`})
            }

            /**
             * kalau udah ada ga usah bikin user
             * kalau belum bikin, bikin
             */
            let user = await User.findOne({ email }).exec()
            if (user) {
                let token = jwt.sign({ user: user._id })
                res.json({ access_token: token, email: user.email })
            } else {
                await User.create({ email, password: Math.random() })
                let user = await User.findOne({ email })
                let token = jwt.sign({ user: user._id  })
                res.json({ access_token: token, email })
            }

        } catch (err) {
            next(err)
        }
    }
}

module.exports = Controller