const { User } = require('../models')
const { checkPassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class UserController{
    static findAll(req, res, next){
        User.find()
            .then(users => {
                res.json(users)
            })
            .catch(next)
    }

    // static delete(req, res, next){
    //     let searchObj = {
    //         _id: ObjectId(req.params.id)
    //     }
    //     User.deleteOne(searchObj)
    //         .then(result => {
    //             if(!result || result.n === 0){
    //                 throw {code: 404}
    //             } else {
    //                 res.json(result)
    //             }
    //         })
    //         .catch(next)
    // }

    static register(req, res, next){
        const { username, email, password } = req.body
        const input = { username, email, password }
        User.create(input)
            .then(result => {
                res.status(201).json(result)
            })
            .catch(next)
    }

    static login(req, res, next){
        const { email, password } = req.body
        const input = { email, password }
        User.findOne({ email: input.email })
            .then(user => {
                if(user){
                    if(checkPassword(input.password, user.password)){
                        const payload = {
                            username: user.username,
                            email: user.email,
                            id: user.id
                        }
                        const token = generateToken(payload)
                        res.json({
                            token,
                            username: user.username
                        })
                    } else {
                        throw({code: 404, message: 'Invalid password'})
                    }
                } else {
                    throw({code: 404, message: 'Email not registered'})
                }
            })
            .catch(next)
    }
    
    // static googleLogin(req, res, next){
    //     const {OAuth2Client} = require('google-auth-library');
    //     const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    //     let ticketPayload
    //     async function verify(){
    //         const ticket = await client.verifyIdToken({
    //             idToken: req.body.idToken,
    //             audience: process.env.GOOGLE_CLIENT_ID
    //         })
    //         const payload = ticket.getPayload()
    //         let user = await User.findOne({email: payload.email})
    //         if(!user){
    //             console.log("New User")
    //             const input = {
    //                 username: ticketPayload.name,
    //                 email: ticketPayload.email,
    //                 password: `${Math.random().toString(36).substring(7)}`
    //             }
    //             user = await User.create(input)
    //         }
    //         const payload = {
    //             username: user.username,
    //             email: user.email,
    //             id: user.id
    //         }
    //         let token = generateToken(payload)
    //         res.json({ token })
    //     }
    //     verify()
    //     .catch(next)

    //     // client.verifyIdToken({
    //     //     idToken: req.body.idToken,
    //     //     audience: process.env.GOOGLE_CLIENT_ID
    //     // })
    //     //     .then(function(ticket){
    //     //         ticketPayload = ticket.getPayload()
    //     //         return User.findOne({email: ticketPayload.email})
    //     //     })
    //     //     .then(user => {
    //     //         if(!user){
    //     //             console.log("User not exist");
    //     //             const input = {
    //     //                 username: ticketPayload.name,
    //     //                 email: ticketPayload.email,
    //     //                 password: `${Math.random().toString(36).substring(7)}`
    //     //             }
    //     //             return User.create(input)
    //     //         } else {
    //     //             return user
    //     //         }
    //     //     })
    //     //     .then(user => {
    //     //         const payload = {
    //     //             username: result.username,
    //     //             email: result.username,
    //     //             id: result.id
    //     //         }
    //     //         let token = geneerateToken(payload)
    //     //         res.json({ token })
    //     //     })
    //     //     .catch(next)
    // }
}

module.exports = UserController // from class name