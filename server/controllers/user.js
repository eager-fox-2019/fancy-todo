const {User} = require('../models')
const {sign} = require('../helpers/jwt')
const {decrypt} = require('../helpers/bcrypt')

class userControllers {

    static register(req, res, next){
        let data = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }
        User.create(data)
        .then(function (response){
            res.status(201).json(response)
        })
        .catch(next)
    }
    
    static login(req, res, next) {
        let data = {
            email: req.body.email,
            password: req.body.password
        }
        User.findOne({ where:{email: data.email} })
        .then(function (response) {
            if(response){
                if(decrypt(data.password, response.password)){
                    let payload = {
                        id: response.id,
                        username: response.username,
                        email: response.email
                    }
                let token = sign(payload)
                res.status(200).json({token})
                }else{
                    res.status(401).json({msg: "Email or Password wrong"})
                }
            }else{
                throw({ code: 404 })
            }
        })
        .catch(next)
    }
}

module.exports = userControllers