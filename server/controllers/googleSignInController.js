const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { createToken } = require('../helpers/jwt')
const User = require('../models/userModel')

class OauthController{
    static loginFromGoogle(req, res, next){
        const token = req.body.idToken
        client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then((ticket) => {
            const { name, email, picture } = ticket.getPayload()
            return User.findOne({
                email
            })
            .then((found) => {
                if(found){
                    let id = found._id
                    const myToken = createToken({ name ,email, picture })
                    res.status(200).json({
                        token: myToken,
                        email,
                        name,
                        picture,
                        id
                    })
                }else{
                    let password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    return User.create({
                        name, email, password
                    })
                    .then((newUser) => {
                        let id = newUser._id
                        const myToken = createToken({ name ,email, picture })
                        res.status(200).json({
                            token: myToken,
                            email,
                            name,
                            picture,
                            id
                        })  
                    })
                }
            })
        })
        .catch(next)
    }
}

module.exports = OauthController