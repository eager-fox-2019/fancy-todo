const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_KEY);

class UserController{
    static register(req,res,next){
        console.log(req.body);
        
        User.create({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password
        })
        .then((newuser)=>{
            res.status(201).json(newuser)
        })
        .catch(next)
    }

    static login(req,res,next){
        console.log(req.body);
        
        User.findOne({email: req.body.email},function(err,user){
            if(err){
                throw err
            }else{
                if(user){
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                        let obj = {
                            id: user._id,
                            email: user.email
                        }
                        res.json({token: jwt.sign(obj)})
                        
                    } else {
                        res.status(400).json({
                            message: "wrong password"
                        })
                    }
                }else{
                    res.status(404).json({
                        message: "username wrong"
                    })
                }
            }
        })
    }

    static signInWithGoogle(req,res,next){
        client
            .verifyIdToken({
                idToken: req.body.id_token,
                audience: process.env.GOOGLE_CLIENT_KEY
            })
            .then(function(ticket) {
                const { email, name, picture } = ticket.getPayload();
                const accessToken = jwt.sign({email})
                
                User.findOne({email: email},function(err,user){
                    if(err){
                        res.status(500).json({
                            message: "Internal Server Error"
                        })
                    }else{
                        if(user == null){
                            return User.create({
                                username: `${ticket.getPayload().given_name}`,
                                email: email,
                                password: `todo${ticket.getPayload().given_name}`
                            })
                        }
                    }
                })
            
                res.status(200).json({ email, name, picture,accessToken});
              })
              .then((newuser)=>{
                  console.log('create')
                res.status(201).json(newuser)
              })
              .catch(next);
        
    }

}

module.exports = UserController