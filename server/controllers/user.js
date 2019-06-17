const User = require('../models/user')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

class userController{
    static signIn(req,res,next){
        User.findOne({
            email:req.body.email
        })
        .then((user) => {
            if(user){
                if(compare(req.body.password,user.password)){
                    const payload = {
                        id: user._id,
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name
                    }
                    const token = sign(payload)
                    res.status(200).json({
                        token
                    })
                }
                else{
                    throw ({status:400,message:'Wrong Email/Password'})
                }
            }
            else{
                throw ({status:400,message:'Wrong Email/Password'})
            }
        })
        .catch(next)
    }

    static signUp(req,res,next){
        const userData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password
        }
        User
        .create(userData)
        .then((regUser) => {
            res.status(201).json({regUser,message: 'Thanks for registering'})
        })
        .catch(next)
    }

    static gSignIn(req,res,next){
        async function verify(){
            const ticket = await client.verifyIdToken({
                idToken:req.body.token,
                audience:process.env.CLIENT_ID
            })
            const payload = ticket.getPayload()
            const email = payload.email
            const userPayload = await User.findOne({
                email:email
            })
            if(userPayload){
                const payload = {
                    first_name: userPayload.first_name,
                    last_name: userPayload.last_name,
                    id:userPayload._id,
                    email:userPayload.email
                }
                const token = sign(payload)
                res.status(200).json(token)
            }
            else{
                const createdUser = await User.create({
                        first_name:payload.given_name,
                        last_name:payload.family_name,
                        email:email,
                        password:process.env.PASSWORD
                })
                const payloadUser = {
                    id:createdUser._id,
                    email:createdUser.email,
                    first_name:createdUser.first_name,
                    last_name:createdUser.last_name,
                }
                const token = sign(payloadUser)
                res.status(200).json(token)
            }
        }
        verify().catch(next)
    }
}

module.exports = userController